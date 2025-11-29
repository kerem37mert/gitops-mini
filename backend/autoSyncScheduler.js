import db from "./db.js";
import { k8sApi, k8sAppsApi, k8sNetworkingApi, REPOS_DIR } from "./k8s.js";
import path from "path";
import fs from "fs-extra";
import simpleGit from "simple-git";
import yaml from "js-yaml";

// Auto-sync interval in milliseconds (default: 5 minutes)
const AUTO_SYNC_INTERVAL = process.env.AUTO_SYNC_INTERVAL_MS || 300000;

let syncInterval = null;

// Synchronization logic extracted from synchronization.js
const performSync = async (app) => {
    const syncStartTime = Date.now();
    const id = app.id;

    try {
        console.log(`[AUTO-SYNC] Starting sync for app: ${app.projectName} (ID: ${id})`);

        // Delete previously cloned repo
        const repoDir = path.join(REPOS_DIR, String(app.id));
        await fs.remove(repoDir);

        // Clone repo
        const git = simpleGit();
        try {
            await git.clone(app.repoURL, repoDir, ['--branch', app.branchName, '--depth', '1']);
        } catch (error) {
            // Git clone error - mark sync as failed
            db.prepare(`
                UPDATE apps 
                SET syncStatus='failed',
                    errorMessage=?,
                    status='failed'
                WHERE id=?
            `).run(error.message, id);

            console.error(`[AUTO-SYNC] Git clone failed for ${app.projectName}:`, error.message);
            return;
        }

        // Get manifests directory path
        const manifestsDir = path.join(repoDir, app.repoPath);
        const files = await fs.readdir(manifestsDir);

        // Filter yaml manifest files
        const yamlFiles = files.filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));

        const results = [];
        const deployments = [];

        // Apply all manifest files
        for (const file of yamlFiles) {
            const filePath = path.join(manifestsDir, file);
            const content = await fs.readFile(filePath, 'utf8');
            const manifests = yaml.loadAll(content);

            for (const manifest of manifests) {
                if (!manifest) continue;

                try {
                    const result = await applyManifest(manifest, app.namespace);

                    if (manifest.kind === "Deployment")
                        deployments.push({
                            name: manifest.metadata.name,
                            namespace: app.namespace
                        });

                    results.push({
                        file,
                        kind: manifest.kind,
                        name: manifest.metadata.name,
                        status: true,
                        result
                    });
                } catch (error) {
                    console.error(`[AUTO-SYNC] Error applying manifest ${file}:`, error);
                    results.push({
                        file,
                        kind: manifest.kind,
                        name: manifest.metadata?.name,
                        status: false,
                        error: error.message
                    });
                }
            }
        }

        // Restart deployments
        for (const deployment of deployments) {
            try {
                await restartDeployment(deployment.name, deployment.namespace);
            } catch (error) {
                console.error(`[AUTO-SYNC] Deployment restart error: ${deployment.name}`, error.message);
            }
        }

        // Sync successful - update metrics
        const syncDuration = Date.now() - syncStartTime;
        const hasErrors = results.some(r => !r.status);

        try {
            const stmt = db.prepare(`
                UPDATE apps 
                SET lastSync=?, 
                    syncStatus=?,
                    syncCount=syncCount+1,
                    lastSyncDuration=?,
                    errorMessage=NULL,
                    status=?
                WHERE id=?
            `);
            stmt.run(
                new Date().toISOString(),
                hasErrors ? 'failed' : 'success',
                syncDuration,
                hasErrors ? 'failed' : 'active',
                id
            );

            console.log(`[AUTO-SYNC] Sync completed for ${app.projectName} - Status: ${hasErrors ? 'FAILED' : 'SUCCESS'}, Duration: ${syncDuration}ms`);
        } catch (error) {
            throw error;
        }

    } catch (error) {
        console.error(`[AUTO-SYNC] Synchronization error for ${app.projectName}:`, error);

        // General error - mark sync as failed
        try {
            db.prepare(`
                UPDATE apps 
                SET syncStatus='failed',
                    errorMessage=?,
                    status='failed'
                WHERE id=?
            `).run(error.message, id);
        } catch (dbError) {
            console.error(`[AUTO-SYNC] Failed to update error status:`, dbError);
        }
    }
}

// Manifest application function
const applyManifest = async (manifest, namespace) => {
    const kind = manifest.kind;

    // Create namespace if it doesn't exist in minikube
    try {
        await k8sApi.readNamespace(namespace);
    } catch (error) {
        if (error.statusCode === 404 || error.code === 404)
            await k8sApi.createNamespace({
                metadata: {
                    name: namespace
                }
            });
    }

    switch (kind) {
        case "Deployment":
            return await applyDeployment(manifest, namespace);
        case "Service":
            return await applyService(manifest, namespace);
        case "Ingress":
            return await applyIngress(manifest, namespace);
        default:
            throw new Error(`Unknown type: ${kind}`);
    }
}

// Deployment application function
const applyDeployment = async (manifest, namespace) => {
    const name = manifest.metadata.name;

    try {
        await k8sAppsApi.readNamespacedDeployment({
            name,
            namespace
        });

        return await k8sAppsApi.replaceNamespacedDeployment({
            name,
            namespace,
            body: manifest
        });
    } catch (error) {
        if (error.statusCode === 404 || error.code === 404)
            return await k8sAppsApi.createNamespacedDeployment({
                namespace,
                body: manifest
            });
        throw error;
    }
}

// Service application function
const applyService = async (manifest, namespace) => {
    const name = manifest.metadata.name;

    try {
        await k8sApi.readNamespacedService({
            name,
            namespace
        });

        return await k8sApi.replaceNamespacedService({
            name,
            namespace,
            body: manifest
        });
    } catch (error) {
        if (error.statusCode === 404 || error.code === 404)
            return await k8sApi.createNamespacedService({
                namespace,
                body: manifest
            });
        throw error;
    }
}

// Deployment restart function
const restartDeployment = async (name, namespace) => {
    try {
        const { body: deployment } = await k8sAppsApi.readNamespacedDeployment({
            name,
            namespace
        });

        if (!deployment.spec.template.metadata)
            deployment.spec.template.metadata = {};

        if (!deployment.spec.template.metadata.annotations)
            deployment.spec.template.metadata.annotations = {};

        deployment.spec.template.metadata.annotations['kubectl.kubernetes.io/restartedAt'] = new Date().toISOString();

        return await k8sAppsApi.replaceNamespacedDeployment({
            name: name,
            namespace: namespace,
            body: deployment
        });
    } catch (error) {
        console.error(`Restart error: ${name}`, error.message);
        throw error;
    }
}

// Ingress application function
const applyIngress = async (manifest, namespace) => {
    const name = manifest.metadata.name;

    try {
        await k8sNetworkingApi.readNamespacedIngress({
            name,
            namespace
        });

        return await k8sNetworkingApi.replaceNamespacedIngress({
            name,
            namespace,
            body: manifest
        });
    } catch (error) {
        if (error.statusCode === 404 || error.code === 404)
            return await k8sNetworkingApi.createNamespacedIngress({
                namespace,
                body: manifest
            });
        throw error;
    }
}

// Auto-sync check function
const checkAndSyncApps = async () => {
    try {
        // Get all apps with autoSync enabled
        const apps = db.prepare('SELECT * FROM apps WHERE autoSync = 1').all();

        if (apps.length === 0) {
            console.log('[AUTO-SYNC] No apps with auto-sync enabled');
            return;
        }

        console.log(`[AUTO-SYNC] Found ${apps.length} app(s) with auto-sync enabled`);

        // Sync each app
        for (const app of apps) {
            await performSync(app);
        }

    } catch (error) {
        console.error('[AUTO-SYNC] Error in auto-sync check:', error);
    }
}

// Start auto-sync scheduler
export const startAutoSync = () => {
    if (syncInterval) {
        console.log('[AUTO-SYNC] Scheduler already running');
        return;
    }

    console.log(`[AUTO-SYNC] Starting scheduler with interval: ${AUTO_SYNC_INTERVAL}ms (${AUTO_SYNC_INTERVAL / 60000} minutes)`);

    // Run immediately on start
    checkAndSyncApps();

    // Then run at intervals
    syncInterval = setInterval(checkAndSyncApps, AUTO_SYNC_INTERVAL);
}

// Stop auto-sync scheduler
export const stopAutoSync = () => {
    if (syncInterval) {
        clearInterval(syncInterval);
        syncInterval = null;
        console.log('[AUTO-SYNC] Scheduler stopped');
    }
}

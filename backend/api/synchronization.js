import db from "../db.js";
import { k8sApi, k8sAppsApi, k8sNetworkingApi, REPOS_DIR } from "../k8s.js";
import path from "path";
import fs from "fs-extra";
import simpleGit from "simple-git";
import yaml from "js-yaml";

export const synchronization = async (req, res) => {
    const id = req.params.id;
    const syncStartTime = Date.now();

    try {
        const app = db.prepare("SELECT * FROM apps WHERE id=?").get(id);

        // eğer veritabanında yoksa
        if (!app)
            return res.status(404).json({
                message: "uygulama bulunamadı"
            });

        // daha önceden klonlanmış repoyu tekrar clonelamadan önce sil
        const repoDir = path.join(REPOS_DIR, String(app.id));
        await fs.remove(repoDir);

        // repoyu clonela
        const git = simpleGit();
        try {
            await git.clone(app.repoURL, repoDir, ['--branch', app.branchName, '--depth', '1']);
        } catch (error) {
            // Git clone hatası - sync failed olarak işaretle
            db.prepare(`
                UPDATE apps 
                SET syncStatus='failed',
                    errorMessage=?,
                    status='failed'
                WHERE id=?
            `).run(error.message, id);

            return res.status(500).json({
                message: error.message
            });
        }

        // mainefest dosyalarının bulundupu yolu elde et
        const manifestsDir = path.join(repoDir, app.repoPath);
        const files = await fs.readdir(manifestsDir);

        // yoldaki dosyalardan manifest dosyaası olanları filtrele
        // mainefst dosyaları yaml formtatındadır
        const yamlFiles = files.filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));

        const results = [];
        const deployments = [];

        // tüm manifest dosyalarını uygula
        for (const file of yamlFiles) {
            const filePath = path.join(manifestsDir, file); // manifest dosyasının yolu
            const content = await fs.readFile(filePath, 'utf8'); // manifest dosyası içeriği
            const manifests = yaml.loadAll(content); // okyunan yaml içeriğini dizi şeklinde js objesine çevir

            // manifests dizisi içerisindeki manifestleri gez
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
                    console.error(`Error applying manifest ${file}:`, error);
                    results.push({
                        file,
                        kind: manifest.kind,
                        name: manifest.metadata?.name,
                        status: false,
                        error: error.message,
                        stack: error.stack,
                        details: error.body || "No additional details"
                    });
                }
            }
        }

        // deploymentsları yeniden başlat
        for (const deployment of deployments) {
            try {
                await restartDeployment(deployment.name, deployment.namespace);
            } catch (error) {
                console.error(`Deployment yeniden başlatma hatası: ${deployment.name}`, error.message);
            }
        }

        // Sync başarılı - metrikleri güncelle
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
        } catch (error) {
            throw error;
        }

        res.json({
            status: true,
            results,
            syncDuration
        })

        // veri tabanı sorgu hatası
    } catch (error) {
        console.error("Synchronization error:", error);

        // Genel hata - sync failed olarak işaretle
        try {
            db.prepare(`
                UPDATE apps 
                SET syncStatus='failed',
                    errorMessage=?,
                    status='failed'
                WHERE id=?
            `).run(error.message, id);
        } catch (dbError) {
            console.error("Failed to update error status:", dbError);
        }

        res.status(500).json({
            message: error.message,
            stack: error.stack,
            details: error.body || "No additional details"
        });
    }
}


// Manifest uygulama fonksiyonu
const applyManifest = async (manifest, namespace) => {
    const kind = manifest.kind;

    // minkubeda namespace yoksa oluştur
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
            throw new Error(`bilinmeyen tür: ${kind}`);
    }
}


// Deployment uygulama fonksiyonu
const applyDeployment = async (manifest, namespace) => {
    const name = manifest.metadata.name;

    try {
        // deployment olup olmadığını kontrol et. yoksa catche düşecek
        await k8sAppsApi.readNamespacedDeployment({
            name,
            namespace
        });

        // yeni deploymentı uygula.
        // kubectl apply -f deployment.yaml 
        return await k8sAppsApi.replaceNamespacedDeployment({
            name,
            namespace,
            body: manifest
        });
    } catch (error) {
        if (error.statusCode === 404 || error.code === 404)
            // deployment yoksa oluştur
            return await k8sAppsApi.createNamespacedDeployment({
                namespace,
                body: manifest
            });
        throw error;
    }
}

// Service uygulama fonksiyonu
const applyService = async (manifest, namespace) => {
    const name = manifest.metadata.name;

    try {
        await k8sApi.readNamespacedService({
            name,
            namespace
        });

        // kubectl apply -f deployment.yaml 
        return await k8sApi.replaceNamespacedService({
            name,
            namespace,
            body: manifest
        });
    } catch (error) {
        if (error.statusCode === 404 || error.code === 404)
            // service yoksa oluştur
            return await k8sApi.createNamespacedService({
                namespace,
                body: manifest
            });
        throw error;
    }
}

// Deploymentı yeniden balatma fonku
const restartDeployment = async (name, namespace) => {
    try {
        // Mevcut deploymento oku
        const { body: deployment } = await k8sAppsApi.readNamespacedDeployment({
            name,
            namespace
        });

        if (!deployment.spec.template.metadata)
            deployment.spec.template.metadata = {};

        if (!deployment.spec.template.metadata.annotations)
            deployment.spec.template.metadata.annotations = {};

        deployment.spec.template.metadata.annotations['kubectl.kubernetes.io/restartedAt'] = new Date().toISOString();

        // Deploymentı güncelle
        return await k8sAppsApi.replaceNamespacedDeployment({
            name: name,
            namespace: namespace,
            body: deployment
        });
    } catch (error) {
        console.error(`yenşden başlatma hatası: ${name}`, error.message);
        throw error;
    }
}

// Ingress uygulama fonksiyonu
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
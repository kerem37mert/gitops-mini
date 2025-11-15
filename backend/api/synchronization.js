import db from "../db.js";
import { k8sApi, k8sAppsApi, REPOS_DIR } from "../k8s.js";
import path from "path";
import fs from "fs-extra";
import simpleGit from "simple-git";
import yaml from "js-yaml";

export const synchronization = async (req, res) => {
    const id = req.params.id;

    try {
        const app = db.prepare("SELECT * FROM apps WHERE id=?").get(id);

        // eğer veritabanında yoksa
        if(!app)
            return res.status(404).json({
                message: "uygulama bulunamadı"
        });

        // daha önceden klonlanmış repoyu tekrar clonelamadan önce sil
        const repoDir = path.join(REPOS_DIR, String(app.id));
        await fs.remove(repoDir);

        // repoyu clonela
        const git = simpleGit();
        await git.clone(app.repoURL, repoDir, ['--branch', app.branchName, '--depth', '1']);

        // mainefest dosyalarının bulundupu yolu elde et
        const manifestsDir = path.join(repoDir, app.repoPath); 
        const files = await fs.readdir(manifestsDir);

        // yoldaki dosyalardan manifest dosyaası olanları filtrele
        // mainefst dosyaları yaml formtatındadır
        const yamlFiles = files.filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));

        const results = [];

        // tüm manifest dosyalarını uygula
        for(const file of yamlFiles) {
            const filePath = path.join(manifestsDir, file); // manifest dosyasının yolu
            const content = await fs.readFile(filePath, 'utf8'); // manifest dosyası içeriği
            const manifests = yaml.loadAll(content); // okyunan yaml içeriğini dizi şeklinde js objesine çevir

            // manifests dizisi içerisindeki manifestleri gez
            for(const manifest of manifests) {
                if (!manifest) continue;

                try {
                    const result = await applyManifest(manifest, app.namespace);
                    results.push({
                        file,
                        kind: manifest.kind,
                        name: manifest.metadata.name,
                        status: true,
                        result
                    });
                } catch(error) {
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

        res.json({
            status: true,
            results
        })
        
    // veri tabanı sorgu hatası
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
        console.log(error);
    }
}


// Manifest uygulama fonksiyonu
const applyManifest = async (manifest, namespace) => {
    const kind = manifest.kind;

    // minkubeda namespace yoksa oluştur
    try {
        await k8sApi.readNamespace(namespace);
    } catch(error) {
        if(error.statusCode === 404)
            await k8sApi.createNamespace({
                metadata: {
                    name: namespace
                }
            }); 
    }

    switch(kind) {
        case "Deployment":
            return await applyDeployment(manifest, namespace);
        case "Service":
            return await applyService(manifest, namespace);
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
    } catch(error) {
        if (error.statusCode === 404)
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
    } catch(error) {
        if (error.statusCode === 404)
            // service yoksa oluştur
            return await k8sApi.createNamespacedService({
                namespace,
                body: manifest
            });
        throw error;
    }
}
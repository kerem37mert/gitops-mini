import * as k8s from "@kubernetes/client-node";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";


// Kubernetes API’sine bağlanmak ve işlemler yapmak için

export const kubernetesClient = new k8s.KubeConfig();

// Minikube configi otomatik olarak yükler
// kubernetesClient.loadFromDefault();
const kubeConfigPath = path.join(process.env.HOME, '.kube', 'config');
console.log(`[DEBUG] Trying to load kubeconfig from: ${kubeConfigPath}`);
console.log(`[DEBUG] File exists: ${fs.existsSync(kubeConfigPath)}`);

if (fs.existsSync(kubeConfigPath)) {
    kubernetesClient.loadFromFile(kubeConfigPath);
    console.log("[DEBUG] Loaded from file.");
} else {
    kubernetesClient.loadFromDefault();
    console.log("[DEBUG] Loaded from default.");
}

console.log(`[DEBUG] Current Context: ${kubernetesClient.currentContext}`);
console.log(`[DEBUG] Clusters: ${JSON.stringify(kubernetesClient.clusters.map(c => ({ name: c.name, server: c.server })))}`);

// HTTP kullanan clusterlar için skipTLSVerify ayarını true yap
for (const cluster of kubernetesClient.clusters) {
    if (cluster.server && cluster.server.startsWith("http:")) {
        cluster.skipTLSVerify = true;
    }
}

export const k8sApi = kubernetesClient.makeApiClient(k8s.CoreV1Api);
export const k8sAppsApi = kubernetesClient.makeApiClient(k8s.AppsV1Api);
export const k8sNetworkingApi = kubernetesClient.makeApiClient(k8s.NetworkingV1Api);

// repoların olacağı klasöürü yoksa oluştur
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const REPOS_DIR = path.join(__dirname, 'repos');
fs.ensureDirSync(REPOS_DIR);

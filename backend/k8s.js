import * as k8s from "@kubernetes/client-node";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";


// Kubernetes API’sine bağlanmak ve işlemler yapmak için

export const kubernetesClient = new k8s.KubeConfig();

// Minikube configi otomatik olarak yükler
kubernetesClient.loadFromDefault();

export const k8sApi = kubernetesClient.makeApiClient(k8s.CoreV1Api);
export const k8sAppsApi = kubernetesClient.makeApiClient(k8s.AppsV1Api);
export const k8sNetworkingApi = kubernetesClient.makeApiClient(k8s.NetworkingV1Api);

// repoların olacağı klasöürü yoksa oluştur
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const REPOS_DIR = path.join(__dirname, 'repos');
fs.ensureDirSync(REPOS_DIR);

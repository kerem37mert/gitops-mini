import db from "../db.js";

const newApp = (req, res) => {
    const {
        projectName,
        repoURL,
        repoPath,
        branchName,
        namespace,
        description,
        autoSync
    } = req.body;

    // Proje ismi veya repo urli boş gelirse hata döndür.
    if (!projectName || !repoURL)
        return res.status(500).json({
            message: "Formda boş alan bulunmamalıdır."
        })

    // gelen veriler app nesnesinde toplanıyor. ve default değer atamalrı yapılıyor.
    const app = {
        projectName,
        repoURL,
        repoPath: repoPath || "./",
        branchName: branchName || "main",
        namespace: namespace || "default",
        description: description || null,
        autoSync: autoSync ? 1 : 0,
        status: 'pending',
        syncStatus: 'pending',
        errorMessage: null,
        syncCount: 0,
        lastSyncDuration: null,
        lastSync: null,
        createdAt: new Date().toISOString()
    };

    console.log(app.createdAt);

    // veriler database'e kaydediliyor.
    try {
        const stmt = db.prepare(
            `INSERT INTO apps (
                projectName, repoURL, repoPath, branchName, namespace, 
                description, autoSync, status, syncStatus, errorMessage, 
                syncCount, lastSyncDuration, lastSync, createdAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        );
        stmt.run(
            app.projectName, app.repoURL, app.repoPath, app.branchName, app.namespace,
            app.description, app.autoSync, app.status, app.syncStatus, app.errorMessage,
            app.syncCount, app.lastSyncDuration, app.lastSync, app.createdAt
        );

        res.json({
            status: true,
            message: app
        });
    } catch (error) {
        res.status(500).json({
            message: "Sunucuda bir sorun oluştu."
        });
        console.log(error)
    }
}

export default newApp;
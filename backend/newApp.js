import db from "./db.js";

const newApp = (req, res) => {
    const {
        projectName,
        repoURL,
        repoPath,
        branchName,
        namespace
    } = req.body;

    // Proje ismi veya repo urli boş gelirse hata döndür.
    if(!projectName || !repoURL)
        return res.status(500).json({
            message: "Formda boş alan bulunmamalıdır."
        })

    // gelen veriler app nesnesinde toplanıyor. ve default değer atamalrı yapılıyor.
    const app = {
        projectName,
        repoURL,
        repoPath: repoPath || "./",
        branchName: branchName || "main",
        namespace: namespace || "default"
    };
    
    // veriler database'e kaydediliyor.
    try {
        const stmt = db.prepare(
            "INSERT INTO apps (projectName, repoURL, repoPath, branchName, namespace) VALUES (?, ?, ?, ?, ?)"
        ); 
        stmt.run(app.projectName, app.repoURL, app.repoPath, app.branchName, app.namespace);

        res.json({
            status: true,
            message: app
        });
    } catch(error) {
        res.status(500).json({
            message: "Sunucuda bir sorun oluştu."
        });
        console.log(error)
    }   
}

export default newApp;
import db from "../db.js";

// Tüm uygulamarı getir.
export const getApps = (req, res) => {
    try {
        const apps = db.prepare("SELECT * FROM apps").all();
        res.json({
            status: true,
            message: apps
        })
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
        console.log(error);
    }
}

// Id'ye göre tek bir uygulama getir.
export const getApp = (req, res) => {
    const id = req.params.id;

    try {
        const app = db.prepare("SELECT * FROM apps WHERE id=?").get(id);

        if(!app)
            return res.status(404).json({
                message: "uygulama bulunamadı"
        });

        res.json({
            status: true,
            message: app
        })
    } catch(error) {
        res.json({
            message: error.message
        });
        console.log(error);
    }
}
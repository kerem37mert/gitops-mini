import express from "express";
import cors from "cors";
import newApp from "./api/newApp.js";
import { getApp, getApps } from "./api/apps.js";
import { synchronization } from "./api/synchronization.js";

const app = express();

app.use(cors());
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/api/newapp", newApp);

app.get("/api/apps", getApps);

app.get("/api/apps/:id", getApp);

// daha sonra post yapcam
app.get("/api/apps/:id/sync", synchronization)

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
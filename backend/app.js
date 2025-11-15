import express from "express";
import cors from "cors";
import newApp from "./api/newApp.js";
import { getApp, getApps } from "./api/apps.js";

const app = express();

app.use(cors());
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/api/newapp", newApp);

app.get("/api/apps", getApps);

app.get("/api/apps/:id", getApp);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
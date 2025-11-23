import express from "express";
import cors from "cors";
import newApp from "./api/newApp.js";
import { getApp, getApps, removeApp } from "./api/apps.js";
import { synchronization } from "./api/synchronization.js";
import { validateRepo, getBranches } from "./api/github.js";

const app = express();

app.use(cors());
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/newapp", newApp);

app.get("/api/apps", getApps);

app.get("/api/apps/:id", getApp);

app.get("/api/apps/:id/remove", removeApp);

// daha sonra post yapcam
app.get("/api/apps/:id/sync", synchronization);

// GitHub API routes
app.post("/api/github/validate", async (req, res) => {
  try {
    const { repoURL } = req.body;
    const result = await validateRepo(repoURL);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/github/branches", async (req, res) => {
  try {
    const { repoURL } = req.body;
    const branches = await getBranches(repoURL);
    res.json({ branches });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(5174, () => {
  console.log('Server is running on port 5174');
});

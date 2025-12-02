import express from "express";
import cors from "cors";
import newApp from "./api/newApp.js";
import { getApp, getApps, removeApp } from "./api/apps.js";
import { synchronization } from "./api/synchronization.js";
import { validateRepo, getBranches } from "./api/github.js";
import { login, logout, getCurrentUser, authenticateToken, requireSuperuser } from "./api/auth.js";
import { getAllUsers, createUser, updateUser, deleteUser, changePassword } from "./api/users.js";
import { startAutoSync } from "./autoSyncScheduler.js";

const app = express();

app.use(cors());
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Auth routes (public)
app.post("/api/auth/login", login);
app.post("/api/auth/logout", authenticateToken, logout);
app.get("/api/auth/me", authenticateToken, getCurrentUser);

// User management routes (protected)
app.get("/api/users", authenticateToken, requireSuperuser, getAllUsers);
app.post("/api/users", authenticateToken, requireSuperuser, createUser);
app.put("/api/users/:id", authenticateToken, requireSuperuser, updateUser);
app.delete("/api/users/:id", authenticateToken, requireSuperuser, deleteUser);
app.put("/api/users/:id/password", authenticateToken, changePassword);

// App routes (protected)
app.post("/api/newapp", authenticateToken, newApp);
app.get("/api/apps", authenticateToken, getApps);
app.get("/api/apps/:id", authenticateToken, getApp);
app.get("/api/apps/:id/remove", authenticateToken, removeApp);
app.get("/api/apps/:id/sync", authenticateToken, synchronization);

// GitHub API routes (protected)
app.post("/api/github/validate", authenticateToken, async (req, res) => {
  try {
    const { repoURL } = req.body;
    const result = await validateRepo(repoURL);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/github/branches", authenticateToken, async (req, res) => {
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

  // Start auto-sync scheduler
  startAutoSync();
});

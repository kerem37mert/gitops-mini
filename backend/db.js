import Database from "better-sqlite3";

const db = new Database("gitopsmini.db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS apps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projectName TEXT,
    repoURL TEXT,
    repoPath TEXT,
    branchName TEXT,
    namespace TEXT,
    lastSync TEXT,
    createdAt TEXT,
    status TEXT DEFAULT 'active',
    syncStatus TEXT DEFAULT 'pending',
    errorMessage TEXT,
    description TEXT,
    syncCount INTEGER DEFAULT 0,
    lastSyncDuration INTEGER,
    autoSync INTEGER DEFAULT 0
  )
`).run();

export default db;
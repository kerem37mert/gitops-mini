import Database from "better-sqlite3";

const db = new Database("gitopsmini.db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS apps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projectName TEXT,
    repoURL TEXT,
    repoPath TEXT,
    branchName TEXT,
    namespace TEXT
  )
`).run();

export default db;
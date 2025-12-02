import Database from "better-sqlite3";
import bcrypt from "bcrypt";

const dbPath = process.env.DB_PATH || "gitopsmini.db";
const db = new Database(dbPath);

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

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`).run();

// Create default superuser if not exists
const existingAdmin = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
if (!existingAdmin) {
  const defaultPassword = 'admin123';
  const passwordHash = bcrypt.hashSync(defaultPassword, 10);
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO users (username, password_hash, role, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `).run('admin', passwordHash, 'superuser', now, now);

  console.log('✅ Default superuser created: username=admin, password=admin123');
}

export default db;
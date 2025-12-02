import Database from 'better-sqlite3';
import { existsSync, unlinkSync } from 'fs';

describe('Database', () => {
    const testDbPath = 'test-gitopsmini.db';
    let db;

    beforeAll(() => {
        // Create a test database
        db = new Database(testDbPath);

        // Create tables
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
    });

    afterAll(() => {
        // Close and cleanup test database
        db.close();
        if (existsSync(testDbPath)) {
            unlinkSync(testDbPath);
        }
    });

    describe('Apps Table', () => {
        test('should create apps table', () => {
            const tableInfo = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='apps'").get();
            expect(tableInfo).toBeDefined();
            expect(tableInfo.name).toBe('apps');
        });

        test('should insert and retrieve an app', () => {
            const app = {
                projectName: 'test-app',
                repoURL: 'https://github.com/test/repo',
                repoPath: '/path/to/repo',
                branchName: 'main',
                namespace: 'default',
                createdAt: new Date().toISOString()
            };

            const result = db.prepare(`
        INSERT INTO apps (projectName, repoURL, repoPath, branchName, namespace, createdAt)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(app.projectName, app.repoURL, app.repoPath, app.branchName, app.namespace, app.createdAt);

            expect(result.changes).toBe(1);
            expect(result.lastInsertRowid).toBeGreaterThan(0);

            const retrieved = db.prepare('SELECT * FROM apps WHERE id = ?').get(result.lastInsertRowid);
            expect(retrieved.projectName).toBe(app.projectName);
            expect(retrieved.status).toBe('active');
            expect(retrieved.syncStatus).toBe('pending');
        });
    });

    describe('Users Table', () => {
        test('should create users table', () => {
            const tableInfo = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
            expect(tableInfo).toBeDefined();
            expect(tableInfo.name).toBe('users');
        });

        test('should insert and retrieve a user', () => {
            const user = {
                username: 'testuser',
                password_hash: 'hashedpassword',
                role: 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const result = db.prepare(`
        INSERT INTO users (username, password_hash, role, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(user.username, user.password_hash, user.role, user.created_at, user.updated_at);

            expect(result.changes).toBe(1);
            expect(result.lastInsertRowid).toBeGreaterThan(0);

            const retrieved = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
            expect(retrieved.username).toBe(user.username);
            expect(retrieved.role).toBe('user');
        });

        test('should enforce unique username constraint', () => {
            const user = {
                username: 'duplicate',
                password_hash: 'hash1',
                role: 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            db.prepare(`
        INSERT INTO users (username, password_hash, role, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(user.username, user.password_hash, user.role, user.created_at, user.updated_at);

            expect(() => {
                db.prepare(`
          INSERT INTO users (username, password_hash, role, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?)
        `).run(user.username, 'hash2', user.role, user.created_at, user.updated_at);
            }).toThrow();
        });
    });
});

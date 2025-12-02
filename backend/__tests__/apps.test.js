import request from 'supertest';
import express from 'express';
import { getApps, getApp } from '../api/apps.js';
import { login, authenticateToken } from '../api/auth.js';

// Create a test app
const app = express();
app.use(express.json());

app.post('/api/auth/login', login);
app.get('/api/apps', authenticateToken, getApps);
app.get('/api/apps/:id', authenticateToken, getApp);

describe('Apps API', () => {
    let authToken;

    beforeAll(async () => {
        // Get a valid token for authenticated requests
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'admin',
                password: 'admin123'
            });
        authToken = loginResponse.body.token;
    });

    describe('GET /api/apps', () => {
        test('should return list of apps with valid token', async () => {
            const response = await request(app)
                .get('/api/apps')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', true);
            expect(response.body).toHaveProperty('message');
            expect(Array.isArray(response.body.message)).toBe(true);
        });

        test('should fail without authentication', async () => {
            const response = await request(app)
                .get('/api/apps');

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/apps/:id', () => {
        test('should return 404 for non-existent app', async () => {
            const response = await request(app)
                .get('/api/apps/99999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
        });

        test('should fail without authentication', async () => {
            const response = await request(app)
                .get('/api/apps/1');

            expect(response.status).toBe(401);
        });
    });
});

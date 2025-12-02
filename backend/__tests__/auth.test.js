import request from 'supertest';
import express from 'express';
import { login, logout, getCurrentUser, authenticateToken } from '../api/auth.js';

// Create a test app
const app = express();
app.use(express.json());

app.post('/api/auth/login', login);
app.post('/api/auth/logout', authenticateToken, logout);
app.get('/api/auth/me', authenticateToken, getCurrentUser);

describe('Authentication API', () => {
    let authToken;

    describe('POST /api/auth/login', () => {
        test('should login with valid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'admin',
                    password: 'admin123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user.username).toBe('admin');
            expect(response.body.user.role).toBe('superuser');

            authToken = response.body.token;
        });

        test('should fail with invalid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'admin',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message');
        });

        test('should fail with missing credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({});

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/auth/me', () => {
        beforeAll(async () => {
            // Get a valid token
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'admin',
                    password: 'admin123'
                });
            authToken = loginResponse.body.token;
        });

        test('should return current user with valid token', async () => {
            const response = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('username', 'admin');
            expect(response.body.user).toHaveProperty('role', 'superuser');
        });

        test('should fail without token', async () => {
            const response = await request(app)
                .get('/api/auth/me');

            expect(response.status).toBe(401);
        });

        test('should fail with invalid token', async () => {
            const response = await request(app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalidtoken');

            expect(response.status).toBe(403);
        });
    });

    describe('POST /api/auth/logout', () => {
        test('should logout successfully with valid token', async () => {
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'admin',
                    password: 'admin123'
                });

            const token = loginResponse.body.token;

            const response = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
        });
    });
});

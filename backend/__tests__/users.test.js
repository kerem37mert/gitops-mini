import request from 'supertest';
import express from 'express';
import { getAllUsers, createUser, updateUser, deleteUser } from '../api/users.js';
import { login, authenticateToken, requireSuperuser } from '../api/auth.js';

// Create a test app
const app = express();
app.use(express.json());

app.post('/api/auth/login', login);
app.get('/api/users', authenticateToken, requireSuperuser, getAllUsers);
app.post('/api/users', authenticateToken, requireSuperuser, createUser);
app.put('/api/users/:id', authenticateToken, requireSuperuser, updateUser);
app.delete('/api/users/:id', authenticateToken, requireSuperuser, deleteUser);

describe('Users API', () => {
    let authToken;
    let createdUserId;

    beforeAll(async () => {
        // Get a valid superuser token
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'admin',
                password: 'admin123'
            });
        authToken = loginResponse.body.token;
    });

    describe('GET /api/users', () => {
        test('should return list of users with superuser token', async () => {
            const response = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('users');
            expect(Array.isArray(response.body.users)).toBe(true);
            expect(response.body.users.length).toBeGreaterThan(0);
            expect(response.body.users[0]).toHaveProperty('username');
            expect(response.body.users[0]).not.toHaveProperty('password_hash');
        });

        test('should fail without authentication', async () => {
            const response = await request(app)
                .get('/api/users');

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/users', () => {
        test('should create a new user with valid data', async () => {
            const newUser = {
                username: `testuser_${Date.now()}`,
                password: 'testpass123',
                role: 'user'
            };

            const response = await request(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${authToken}`)
                .send(newUser);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'User created successfully');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user).toHaveProperty('username', newUser.username);
            expect(response.body.user).toHaveProperty('role', 'user');
            expect(response.body.user).not.toHaveProperty('password_hash');

            createdUserId = response.body.user.id;
        });

        test('should fail with duplicate username', async () => {
            const duplicateUser = {
                username: 'admin',
                password: 'testpass123',
                role: 'user'
            };

            const response = await request(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${authToken}`)
                .send(duplicateUser);

            expect(response.status).toBe(409);
        });

        test('should fail with missing required fields', async () => {
            const response = await request(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ username: 'incomplete' });

            expect(response.status).toBe(400);
        });
    });

    describe('PUT /api/users/:id', () => {
        test('should update user role', async () => {
            if (!createdUserId) {
                // Create a user first if not exists
                const createResponse = await request(app)
                    .post('/api/users')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        username: `testuser_${Date.now()}`,
                        password: 'testpass123',
                        role: 'user'
                    });
                createdUserId = createResponse.body.id;
            }

            const response = await request(app)
                .put(`/api/users/${createdUserId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ role: 'superuser' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'User updated successfully');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('role', 'superuser');
        });

        test('should fail for non-existent user', async () => {
            const response = await request(app)
                .put('/api/users/99999')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ role: 'user' });

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /api/users/:id', () => {
        test('should delete a user', async () => {
            if (!createdUserId) {
                // Create a user first if not exists
                const createResponse = await request(app)
                    .post('/api/users')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        username: `testuser_${Date.now()}`,
                        password: 'testpass123',
                        role: 'user'
                    });
                createdUserId = createResponse.body.id;
            }

            const response = await request(app)
                .delete(`/api/users/${createdUserId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
        });

        test('should fail for non-existent user', async () => {
            const response = await request(app)
                .delete('/api/users/99999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
        });
    });
});

import bcrypt from 'bcrypt';
import db from '../db.js';

// Get all users (superuser only)
export const getAllUsers = (req, res) => {
    try {
        const users = db.prepare('SELECT id, username, role, created_at, updated_at FROM users').all();
        res.json({ users });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create new user (superuser only)
export const createUser = async (req, res) => {
    try {
        const { username, password, role = 'user' } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        if (role !== 'user' && role !== 'superuser') {
            return res.status(400).json({ message: 'Invalid role. Must be "user" or "superuser"' });
        }

        // Check if username already exists
        const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);
        const now = new Date().toISOString();

        // Insert user
        const result = db.prepare(`
      INSERT INTO users (username, password_hash, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(username, passwordHash, role, now, now);

        const newUser = db.prepare('SELECT id, username, role, created_at, updated_at FROM users WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json({
            message: 'User created successfully',
            user: newUser
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update user (superuser only)
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, role } = req.body;

        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (role && role !== 'user' && role !== 'superuser') {
            return res.status(400).json({ message: 'Invalid role. Must be "user" or "superuser"' });
        }

        // Check if new username already exists (if username is being changed)
        if (username && username !== user.username) {
            const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
            if (existingUser) {
                return res.status(409).json({ message: 'Username already exists' });
            }
        }

        const now = new Date().toISOString();

        db.prepare(`
      UPDATE users 
      SET username = COALESCE(?, username),
          role = COALESCE(?, role),
          updated_at = ?
      WHERE id = ?
    `).run(username || null, role || null, now, id);

        const updatedUser = db.prepare('SELECT id, username, role, created_at, updated_at FROM users WHERE id = ?').get(id);

        res.json({
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete user (superuser only)
export const deleteUser = (req, res) => {
    try {
        const { id } = req.params;

        // Prevent deleting yourself
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        db.prepare('DELETE FROM users WHERE id = ?').run(id);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Change password
export const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        // Users can only change their own password, unless they're superuser
        if (req.user.role !== 'superuser' && parseInt(id) !== req.user.id) {
            return res.status(403).json({ message: 'You can only change your own password' });
        }

        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }

        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If not superuser, verify current password
        if (req.user.role !== 'superuser') {
            if (!currentPassword) {
                return res.status(400).json({ message: 'Current password is required' });
            }

            const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Current password is incorrect' });
            }
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 10);
        const now = new Date().toISOString();

        db.prepare(`
      UPDATE users 
      SET password_hash = ?,
          updated_at = ?
      WHERE id = ?
    `).run(passwordHash, now, id);

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const { pool } = require('../config/database');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, phone, image, isAdmin, role, created_at FROM users');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
};

// Create a new user
exports.createUser = async (req, res) => {
    const { name, email, password, phone, image, isAdmin, role } = req.body;

    const allowedRoles = ['user', 'admin', 'staff'];
    const finalRole = allowedRoles.includes(role) ? role : 'user';

    try {
        const [result] = await pool.query(
            `INSERT INTO users (name, email, password, phone, image, isAdmin, role) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, email, password, phone, image || null, isAdmin || false, finalRole]
        );
        res.status(201).json({ message: 'User created', userId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

// Get user details by ID
exports.getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const [rows] = await pool.query('SELECT id, name, email, phone, image, isAdmin, role, created_at FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve user' });
    }
};

// Update an existing user
exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { name, email, phone, image, isAdmin, role } = req.body;
    try {
        await pool.query(
            `UPDATE users SET name = ?, email = ?, phone = ?, image = ?, isAdmin = ?, role = ? WHERE id = ?`,
            [name, email, phone, image || null, isAdmin, role, userId]
        );
        res.json({ message: 'User updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        await pool.query('DELETE FROM users WHERE id = ?', [userId]);
        res.json({ message: 'User deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

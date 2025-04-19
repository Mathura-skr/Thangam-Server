const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, phone, image_url, isAdmin, role, created_at FROM users');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
};

// Create a new user


exports.createUser = async (req, res) => {
    const { name, email, password, phone, image_url, isAdmin, role } = req.body;

    const allowedRoles = ['user', 'admin', 'staff'];
    const finalRole = allowedRoles.includes(role) ? role : 'staff'; // default to staff

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            `INSERT INTO users (name, email, password, phone, image_url, isAdmin, role) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, email, hashedPassword, phone, image_url || null, isAdmin || false, finalRole]
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
        const [rows] = await pool.query('SELECT id, name, email, phone, image_url, isAdmin, role, created_at FROM users WHERE id = ?', [userId]);
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
    console.log("Update data:", req.body);
    
    const userId = req.params.id;
    const { name, email, phone, image_url, isAdmin, role } = req.body;
    
    try {
        const [result] = await pool.query(
            `UPDATE users SET 
             name = ?, 
             email = ?, 
             phone = ?, 
             image_url = ?, 
             isAdmin = ?, 
             role = ? 
             WHERE id = ?`,
            [name, email, phone, image_url || null, isAdmin, role, userId]
        );
        
        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found or no changes made' });
        }
        
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ 
            error: 'Failed to update user',
            details: err.message 
        });
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

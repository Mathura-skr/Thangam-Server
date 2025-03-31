const db = require('../config/database');



// Create a new user
exports.createUser = async (req, res) => {
    const { name, email, password, phone, image, isAdmin, role } = req.body;
    try {
      const [result] = await db.execute(
        `INSERT INTO users (name, email, password, phone, image, isAdmin, role) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, email, password, phone, image || null, isAdmin || false, role || 'user']
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
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
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
    await db.execute(
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
    await db.execute('DELETE FROM users WHERE id = ?', [userId]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};


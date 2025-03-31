const db = require('../config/database');

// Create a new address
exports.createAddress = async (req, res) => {
  const { user_id, street, city, state, zip_code, country } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO addresses (user_id, street, city, state, zip_code, country) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, street, city, state, zip_code, country]
    );
    res.status(201).json({ message: 'Address created', addressId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create address' });
  }
};

// Get addresses for a given user
exports.getAddressesByUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const [rows] = await db.execute('SELECT * FROM addresses WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve addresses' });
  }
};

// Update an address
exports.updateAddress = async (req, res) => {
  const addressId = req.params.id;
  const { street, city, state, zip_code, country } = req.body;
  try {
    await db.execute(
      'UPDATE addresses SET street = ?, city = ?, state = ?, zip_code = ?, country = ? WHERE id = ?',
      [street, city, state, zip_code, country, addressId]
    );
    res.json({ message: 'Address updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update address' });
  }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
  const addressId = req.params.id;
  try {
    await db.execute('DELETE FROM addresses WHERE id = ?', [addressId]);
    res.json({ message: 'Address deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete address' });
  }
};

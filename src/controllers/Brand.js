const db = require('../config/database');

// Create a new brand
exports.createBrand = async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await db.execute('INSERT INTO brands (name) VALUES (?)', [name]);
    res.status(201).json({ message: 'Brand created', brandId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create brand' });
  }
};

// Get all brands
exports.getAllBrands = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM brands');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve brands' });
  }
};

// Update a brand
exports.updateBrand = async (req, res) => {
  const brandId = req.params.id;
  const { name } = req.body;
  try {
    await db.execute('UPDATE brands SET name = ? WHERE id = ?', [name, brandId]);
    res.json({ message: 'Brand updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update brand' });
  }
};

// Delete a brand
exports.deleteBrand = async (req, res) => {
  const brandId = req.params.id;
  try {
    await db.execute('DELETE FROM brands WHERE id = ?', [brandId]);
    res.json({ message: 'Brand deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete brand' });
  }
};

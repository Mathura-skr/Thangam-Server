const db = require('../config/database');


// Create a new category
exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await db.execute('INSERT INTO categories (name) VALUES (?)', [name]);
    res.status(201).json({ message: 'Category created', categoryId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM categories');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve categories' });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;
  try {
    await db.execute('UPDATE categories SET name = ? WHERE id = ?', [name, categoryId]);
    res.json({ message: 'Category updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    await db.execute('DELETE FROM categories WHERE id = ?', [categoryId]);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

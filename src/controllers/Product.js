const db = require('../config/database');

exports.createProduct = async (req, res) => {
   const {
     name,
     brand_id,
     category,
     price,
     stock,
     expiry_date,
     packet_quantity,
     sub_category,
     image  // New field for product image URL
   } = req.body;
   try {
     const [result] = await db.execute(
       `INSERT INTO products 
        (name, brand_id, category, price, stock, expiry_date, packet_quantity, sub_category, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
       [name, brand_id, category, price, stock, expiry_date, packet_quantity, sub_category, image || null]
     );
     res.status(201).json({ message: 'Product created', productId: result.insertId });
   } catch (err) {
     console.error(err);
     res.status(500).json({ error: 'Failed to create product' });
   }
 };

// Get product details by ID
exports.getProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [productId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
};

exports.updateProduct = async (req, res) => {
   const productId = req.params.id;
   const {
     name,
     brand_id,
     category,
     price,
     stock,
     expiry_date,
     packet_quantity,
     sub_category,
     image  // New field for product image URL
   } = req.body;
   try {
     await db.execute(
       `UPDATE products SET name = ?, brand_id = ?, category = ?, price = ?, stock = ?, expiry_date = ?, packet_quantity = ?, sub_category = ?, image = ? WHERE id = ?`,
       [name, brand_id, category, price, stock, expiry_date, packet_quantity, sub_category, image || null, productId]
     );
     res.json({ message: 'Product updated' });
   } catch (err) {
     console.error(err);
     res.status(500).json({ error: 'Failed to update product' });
   }
 };

// Delete a product
exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    await db.execute('DELETE FROM products WHERE id = ?', [productId]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

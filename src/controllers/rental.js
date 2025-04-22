const { pool } = require("../config/database");

// Create a rental product
exports.createRentalProduct = async (req, res) => {
  const { name, brand, description, price, subcategory_name, image_url } = req.body;

  const subcategory = subcategory_name;
    try {
    const [result] = await pool.query(
      "INSERT INTO rental_products (name, brand, description, price, subcategory, image_url) VALUES (?, ?, ?, ?, ?, ?)",
      [name, brand, description, price, subcategory, image_url]
    );
    res.status(201).json({ message: "Rental product created", id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all rental products
exports.getAllRentalProducts = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM rental_products");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a rental product
exports.deleteRentalProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM rental_products WHERE id = ?", [id]);
    res.json({ message: "Rental product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single rental product
exports.getRentalProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM rental_products WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a rental product
exports.updateRentalProduct = async (req, res) => {
  const { id } = req.params;
  const { name, brand, description, price, subcategory, image_url } = req.body;
  try {
    await pool.query(
      "UPDATE rental_products SET name = ?, brand = ?, description = ?, price = ?, subcategory = ?, image_url = ? WHERE id = ?",
      [name, brand, description, price, subcategory, image_url, id]
    );
    res.json({ message: "Rental product updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

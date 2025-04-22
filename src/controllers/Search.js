const { pool } = require("../config/database");

exports.searchProducts = async (req, res) => {
  const query = req.query.query?.trim();
  const category = req.query.category;
  const limit = parseInt(req.query.limit) || 10;

  if (!query || query.length < 2) {
    return res.status(400).json({ message: "Query must be at least 2 characters." });
  }

  try {
    let sql = `SELECT id, name FROM products WHERE name LIKE ?`;
    const params = [`%${query}%`];

    if (category) {
      sql += ` AND category = ?`;
      params.push(category);
    }

    sql += ` ORDER BY name ASC LIMIT ?`;
    params.push(limit);

    const [rows] = await db.execute(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error during search." });
  }
};

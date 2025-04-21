const { pool } = require("../config/database");

class CartModel {
  static async create(cart) {
    const { userId, product_id, unit } = cart;

    const [result] = await pool.query(
      "INSERT INTO carts (user_id, product_id, unit) VALUES (?, ?, ?)",
      [userId, product_id, unit]
    );
    return { id: result.insertId, ...cart };
  }

  static async getByUserId(userId) {
    const [cartItems] = await pool.query(
      `SELECT 
        c.id AS cart_id,
        c.user_id,
        c.product_id,
        c.unit,
        p.id,
        p.name,
        p.image_url,
        p.price,
        p.stock,
        p.description,
        b.name AS brand,
        cat.name AS category
      FROM carts c
      JOIN products p ON c.product_id = p.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN categories cat ON p.category_id = cat.id
      WHERE c.user_id = ?`,
      [userId]
    );
    return cartItems;
  }

  static async updateById(id, updatedFields) {
    const fields = Object.keys(updatedFields);
    const values = Object.values(updatedFields);
    const setClause = fields.map((field) => `\`${field}\` = ?`).join(", ");

    await pool.query(`UPDATE carts SET ${setClause} WHERE id = ?`, [
      ...values,
      id,
    ]);

    const [updatedCart] = await pool.query("SELECT * FROM carts WHERE id = ?", [
      id,
    ]);
    return updatedCart[0] || null;
  }

  static async deleteById(id) {
    const [deleted] = await pool.query("DELETE FROM carts WHERE id = ?", [id]);
    return deleted.affectedRows > 0;
  }

  static async deleteByUserId(userId) {
    const [deleted] = await pool.query("DELETE FROM carts WHERE user_id = ?", [
      userId,
    ]);
    return deleted.affectedRows > 0;
  }
}

module.exports = CartModel;

const { pool } = require("../config/database");

class OrderModel {
  static async create(order) {
    const {
      user_id,
      product_id,
      address_id,
      unit,
      total_price,
      status,
      paymentMode,
    } = order;
    const [result] = await pool.query(
      "INSERT INTO orders (user_id, product_id, address_id, unit, total_price, status, paymentMode) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [user_id, product_id, address_id, unit, total_price, status, paymentMode]
    );
    return { id: result.insertId, ...order };
  }

  static async getByUserId(userId) {
    const [orders] = await pool.query(
      "SELECT * FROM orders WHERE user_id = ?",
      [userId]
    );
    return orders;
  }

  static async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [orders] = await pool.query(
      `
            SELECT o.*, 
                CONCAT(
                    IFNULL(a.street, ''), ', ', 
                    IFNULL(a.city, ''), ', ', 
                    IFNULL(a.district, ''), ', ', 
                    IFNULL(a.province, ''), ', ', 
                    IFNULL(a.zip_code, '')
                ) AS full_address
            FROM orders o
            LEFT JOIN addresses a ON o.address_id = a.id
            ORDER BY o.id DESC
            LIMIT ? OFFSET ?
        `,
      [limit, offset]
    );

    const [total] = await pool.query("SELECT COUNT(*) AS total FROM orders");

    return {
      total: total[0].total,
      orders,
    };
  }

  static async updateById(id, updatedFields) {
    const fields = Object.keys(updatedFields);
    const values = Object.values(updatedFields);
    const setClause = fields.map((field) => `\`${field}\` = ?`).join(", ");

    await pool.query(`UPDATE orders SET ${setClause} WHERE id = ?`, [
      ...values,
      id,
    ]);

    const [updatedOrder] = await pool.query(
      "SELECT * FROM orders WHERE id = ?",
      [id]
    );
    return updatedOrder[0] || null;
  }

  static async getSalesSummary() {
  const [rows] = await pool.query(`
    SELECT 
      o.product_id,
      p.name AS product_name,
      c.name AS category,
      sc.name AS subCategory,
      SUM(o.unit) AS total_units,
      SUM(o.total_price) AS total_sales
    FROM orders o
    JOIN products p ON o.product_id = p.id
    JOIN categories c ON p.category_id = c.id
    JOIN subcategories sc ON p.subcategory_id = sc.id
    GROUP BY o.product_id
    ORDER BY total_units DESC
  `);
  return rows;
}

}

module.exports = OrderModel;

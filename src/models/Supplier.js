const { pool } = require('../config/database');

class Supplier {
    // Create a new supplier
    static async create(supplier) {
        const [result] = await pool.query(
            `INSERT INTO suppliers (name, phone, address, category, product_name, brand, quantity, stock) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                supplier.name,
                supplier.phone,
                supplier.address,
                supplier.category,
                supplier.product_name,
                supplier.brand,
                supplier.quantity,
                supplier.stock
            ]
        );
        return { id: result.insertId, ...supplier };
    }

    // Get all suppliers
    static async getAll() {
  const [suppliers] = await pool.query(`
    SELECT 
      s.*, 
      GROUP_CONCAT(p.id) AS product_ids
    FROM suppliers s
    LEFT JOIN products p ON p.supplier_id = s.id
    GROUP BY s.id
    ORDER BY s.created_at DESC
  `);
  return suppliers;
}


    // Get supplier by ID
    static async getById(id) {
        const [supplier] = await pool.query(
            `SELECT * FROM suppliers WHERE id = ?`,
            [id]
        );
        return supplier.length ? supplier[0] : null;
    }

    // Update supplier by ID
    static async update(id, updatedFields) {
        const fields = Object.keys(updatedFields);
        const values = Object.values(updatedFields);
        const setClause = fields.map(field => `\`${field}\` = ?`).join(', ');

        await pool.query(
            `UPDATE suppliers SET ${setClause} WHERE id = ?`,
            [...values, id]
        );

        return this.getById(id);
    }

    // Delete supplier by ID
    static async delete(id) {
        const [result] = await pool.query(
            `DELETE FROM suppliers WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Supplier;
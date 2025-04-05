const { pool } = require('../config/database');

class Supplier {
    // Create a new supplier
    static async create(supplier) {
        const [result] = await pool.query(
            `INSERT INTO suppliers (name, phone, address, category_id, product_id, product_name, quantity, stock) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                supplier.name,
                supplier.phone,
                supplier.address,
                supplier.category_id,
                supplier.product_id,
                supplier.product_name,
                supplier.quantity,
                supplier.stock
            ]
        );

        return { id: result.insertId, ...supplier };
    }

    // Get all suppliers
    static async getAll() {
        const [suppliers] = await pool.query(`
            SELECT s.*, c.name AS category_name, p.name AS product_name
            FROM suppliers s
            JOIN categories c ON s.category_id = c.id
            JOIN products p ON s.product_id = p.id
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

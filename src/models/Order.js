const { pool } = require('../config/database');

class OrderModel {
    static async create(order) {
        const { user_id, product_id, unit, total_price, status } = order;
        const [result] = await pool.query(
            'INSERT INTO orders (user_id, product_id, unit, total_price, status) VALUES (?, ?, ?, ?, ?)',
            [user_id, product_id, unit, total_price, status]
        );
        return { id: result.insertId, ...order };
    }

    static async getByUserId(userId) {
        const [orders] = await pool.query(
            'SELECT * FROM orders WHERE user_id = ?',
            [userId]
        );
        return orders;
    }

    static async getAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [orders] = await pool.query(
            'SELECT * FROM orders LIMIT ? OFFSET ?',
            [limit, offset]
        );

        const [total] = await pool.query('SELECT COUNT(*) AS total FROM orders');
        return {
            total: total[0].total,
            orders: orders
        };
    }

    static async updateById(id, updatedFields) {
        const fields = Object.keys(updatedFields);
        const values = Object.values(updatedFields);
        const setClause = fields.map(field => `\`${field}\` = ?`).join(', ');

        await pool.query(
            `UPDATE orders SET ${setClause} WHERE id = ?`,
            [...values, id]
        );

        const [updatedOrder] = await pool.query(
            'SELECT * FROM orders WHERE id = ?',
            [id]
        );
        return updatedOrder[0] || null;
    }
}

module.exports = OrderModel;

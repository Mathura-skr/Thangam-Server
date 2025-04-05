const { pool } = require('../config/database');

class CartModel {
    static async create(cart) {
        const { user_id, product_id, product_name, address, paymentMode, quantity, total_price, status } = cart;
// TODO: discount price add
        const [result] = await pool.query(
            'INSERT INTO carts (user_id, product_id, product_name, address, paymentMode, quantity, total_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                user_id,
                product_id,
                product_name,
                address,
                paymentMode,
                quantity,
                total_price,
                status
            ]
        );
        return { id: result.insertId, ...cart };
    }

    static async getByUserId(userId) {
        const [cartItems] = await pool.query(
            'SELECT * FROM carts WHERE user_id = ?',
            [userId]
        );
        return cartItems;
    }

    static async updateById(id, updatedFields) {
        const fields = Object.keys(updatedFields);
        const values = Object.values(updatedFields);
        const setClause = fields.map(field => `\`${field}\` = ?`).join(', ');

        await pool.query(
            `UPDATE carts SET ${setClause} WHERE id = ?`,
            [...values, id]
        );

        const [updatedCart] = await pool.query(
            'SELECT * FROM carts WHERE id = ?',
            [id]
        );
        return updatedCart[0] || null;
    }

    static async deleteById(id) {
        const [deleted] = await pool.query(
            'DELETE FROM carts WHERE id = ?',
            [id]
        );
        return deleted.affectedRows > 0;
    }

    static async deleteByUserId(userId) {
        const [deleted] = await pool.query(
            'DELETE FROM carts WHERE user_id = ?',
            [userId]
        );
        return deleted.affectedRows > 0;
    }
}

module.exports = CartModel;

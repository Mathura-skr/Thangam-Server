const { pool } = require('../config/database');

exports.create = async (req, res) => {
    try {
        const { user_id, product_id, address_id, unit, total_price, status, paymentMode } = req.body;

        const [result] = await pool.query(
            'INSERT INTO orders (user_id, product_id, address_id, unit, total_price, status, paymentMode) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user_id, product_id, address_id, unit, total_price, status, paymentMode]
        );

        const newOrder = {
            id: result.insertId,
            user_id,
            product_id,
            address_id,
            unit,
            total_price,
            status,
            paymentMode
        };

        res.status(201).json(newOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating order, please try again later' });
    }
};


exports.updateById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFields = req.body;

        const fields = Object.keys(updatedFields);
        const values = Object.values(updatedFields);
        const setClause = fields.map(field => `\`${field}\` = ?`).join(', ');

        const [result] = await pool.query(
            `UPDATE orders SET ${setClause} WHERE id = ?`,
            [...values, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const [updatedOrder] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
        res.status(200).json(updatedOrder[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating order, please try again later' });
    }
};

exports.getByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const [orders] = await pool.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting orders, please try again later' });
    }
};

exports.getAll = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const [orders] = await pool.query('SELECT * FROM orders LIMIT ? OFFSET ?', [parseInt(limit), offset]);

        const [total] = await pool.query('SELECT COUNT(*) AS total FROM orders');

        res.status(200).json({
            total: total[0].total,
            orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting orders, please try again later' });
    }
};

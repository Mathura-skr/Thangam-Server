const { pool } = require('../config/database');

class Favourites {
    static async create(favourite) {
        const { user_id, product_id } = favourite;
        const [result] = await pool.query(
            'INSERT INTO favourites (user_id, product_id) VALUES (?, ?)',
            [user_id, product_id]
        );
        return { id: result.insertId, ...favourite };
    }

    static async getByUserId(userId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [favourites] = await pool.query(
            'SELECT * FROM favourites WHERE user_id = ? LIMIT ? OFFSET ?',
            [userId, limit, offset]
        );

        const [total] = await pool.query('SELECT COUNT(*) AS total FROM favourites WHERE user_id = ?', [userId]);
        return {
            total: total[0].total,
            favourites
        };
    }

    static async updateById(id, updatedFields) {
        const fields = Object.keys(updatedFields);
        const values = Object.values(updatedFields);
        const setClause = fields.map(field => `\`${field}\` = ?`).join(', ');

        await pool.query(
            `UPDATE favourites SET ${setClause} WHERE id = ?`,
            [...values, id]
        );

        const [updatedFavourite] = await pool.query(
            'SELECT * FROM favourites WHERE id = ?',
            [id]
        );
        return updatedFavourite[0] || null;
    }

    static async deleteById(id) {
        const [deleted] = await pool.query('DELETE FROM favourites WHERE id = ?', [id]);
        return deleted.affectedRows > 0 ? { message: 'Product removed from favourites' } : null;
    }
}

module.exports = Favourites;

const { pool } = require('../config/database');

class AddressModel {
    static async create(address) {
        const [result] = await pool.query(
            'INSERT INTO addresses (user_id, street, city, district, province, zip_code) VALUES (?, ?, ?, ?, ?, ?)',
            [
                address.user_id,
                address.street,
                address.city,
                address.district,
                address.province,
                address.zip_code,
            ]
        );
        return { id: result.insertId, ...address };
    }

    static async getByUserId(userId) {
        const [addresses] = await pool.query(
            'SELECT * FROM addresses WHERE user_id = ?',
            [userId]
        );
        return addresses;
    }

    static async updateById(id, updatedFields) {
        const fields = Object.keys(updatedFields);
        const values = Object.values(updatedFields);
        const setClause = fields.map(field => `\`${field}\` = ?`).join(', ');
        
        await pool.query(
            `UPDATE addresses SET ${setClause} WHERE id = ?`,
            [...values, id]
        );
        
        const [updatedAddress] = await pool.query(
            'SELECT * FROM addresses WHERE id = ?',
            [id]
        );
        return updatedAddress[0] || null;
    }

    static async deleteById(id) {
        const [deleted] = await pool.query(
            'DELETE FROM addresses WHERE id = ?',
            [id]
        );
        return deleted.affectedRows > 0;
    }
}

module.exports = AddressModel;

const { pool } = require('../config/database');

class BrandModel {
    static async getAll() {
        const [brands] = await pool.query('SELECT * FROM brands');
        return brands;
    }
}

module.exports = BrandModel;
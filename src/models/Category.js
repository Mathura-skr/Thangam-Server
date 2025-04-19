const { pool } = require('../config/database');

class CategoryModel {
    static async getAll() {
        const [categories] = await pool.query('SELECT * FROM categories');
        return categories;
    }
}

module.exports = CategoryModel;

const { pool } = require('../config/database');

class Subcategory {
    static async create({ sub_categoryName, categoryId }) {
        const query = `INSERT INTO subcategories (sub_categoryName, categoryId) VALUES (?, ?)`;
        const [result] = await pool.execute(query, [sub_categoryName, categoryId]);
        return { id: result.insertId, sub_categoryName, categoryId };
    }

    static async getAll() {
        const [subcategories] = await pool.execute('SELECT * FROM subcategories');
        return subcategories;
    }

    static async getByCategoryId(categoryId) {
        const [subcategories] = await pool.execute('SELECT * FROM subcategories WHERE categoryId = ?', [categoryId]);
        return subcategories;
    }

    static async deleteById(id) {
        await pool.execute('DELETE FROM subcategories WHERE id = ?', [id]);
        return { message: 'Subcategory deleted successfully' };
    }
}

module.exports = Subcategory;
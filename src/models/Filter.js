const { pool } = require("../config/database");

class Filter {
  static async getCategories() {
    const [rows] = await pool.execute("SELECT id, name FROM categories");
    return rows;
  }

  static async getSubCategories(categoryId) {
    const [rows] = await pool.execute(
      "SELECT DISTINCT s.name as sub_category FROM subcategories s JOIN products p ON s.id = p.subcategory_id WHERE p.category_id = ?",
      [categoryId]
    );
    return rows.map(r => r.sub_category);
  }

  static async getBrands(categoryId) {
    const [rows] = await pool.execute(
      "SELECT DISTINCT b.name as brand FROM brands b JOIN products p ON b.id = p.brand_id WHERE p.category_id = ?",
      [categoryId]
    );
    return rows.map(r => r.brand);
  }

  static async getSizes(categoryId) {
    const [rows] = await pool.execute(
      "SELECT DISTINCT quantity FROM products WHERE category_id = ? AND quantity IS NOT NULL",
      [categoryId]
    );
    return rows.map(r => r.quantity);
  }
}

module.exports = Filter;

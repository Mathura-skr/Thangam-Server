import { pool } from '../config/database.js';

export class CategoryModel {
   static async getAll() {
      const [categories] = await pool.query('SELECT * FROM categories');
      return categories;
   }

   static async getByName({ name }) {
      const [categories] = await pool.query(
         'SELECT * FROM categories WHERE LOWER(name) = ?',
         [name.toLowerCase()]
      );

      if (categories.length === 0) return null;

      return categories[0];
   }

   static async create({ name }) {
      const [category] = await pool.query(
         'INSERT INTO categories (name) VALUES (?)',
         [name]
      );
      return category;
   }
}

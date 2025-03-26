import { pool } from '../config/database.js';

export class ProductModel {
   static async getAll({ page = 1, take = 10, name = '', categoryId }) {
      const baseQuery =
         'SELECT * FROM products WHERE name COLLATE UTF8_GENERAL_CI LIKE ?';
      if (categoryId) {
         const [products] = await pool.query(
            `${baseQuery} AND category_id = ? LIMIT ${
               (page - 1) * take
            }, ${take}`,
            [`%${name}%`, categoryId]
         );

         return products;
      }

      const [products] = await pool.query(
         `${baseQuery} LIMIT ${(page - 1) * take}, ${take}`,
         [`%${name}%`]
      );

      return products;
   }

   static async count({ categoryId, name = '' }) {
      const baseQuery =
         'SELECT COUNT(product_id) AS count_products FROM products WHERE name COLLATE UTF8_GENERAL_CI LIKE ?';
      if (categoryId) {
         const [result] = await pool.query(`${baseQuery} AND category_id = ?`, [
            `%${name}%`,
            categoryId,
         ]);

         return result[0]?.count_products;
      }

      const [result] = await pool.query(`${baseQuery}`, [`%${name}%`]);

      return result[0]?.count_products;
   }

   static async getById({ productId }) {
      const [products] = await pool.query(
         'SELECT * FROM products WHERE product_id = ?',
         [productId]
      );

      if (products.length === 0) {
         return null;
      }
      return products[0];
   }

   static async create({ product }) {
      const [result] = await pool.query(
         'INSERT INTO products (name, brand, category_id, sub_category, price, description, stock, size, image) ' +
'VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
         [
            product.name,
            product.brand,
            product.category,
            product.subCategory,
            product.price,
            product.description,
            product.stock,
            product.size,
            product.image,
         ]
      );


      const [products] = await pool.query(
         'SELECT * FROM products WHERE product_id = ?',
         [result.insertId]
      );

      return products[0];
   }

   static async update({ product, productId }) {
      await pool.query('UPDATE products SET ? WHERE product_id = ?', [
         product,
         productId,
      ]);
      const [products] = await pool.query(
         'SELECT * FROM products WHERE product_id = ?',
         [productId]
      );

      return products[0];
   }

   static async delete({ productId }) {
      const [result] = await pool.query(
         'DELETE FROM products WHERE product_id = ?',
         [productId]
      );

      return result.affectedRows !== 0;
   }
}

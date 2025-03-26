import { pool } from '../config/database.js';

export class PurchaseModel {
   static async getAll({ page = 1, take = 5, status = true }) {
      const [purchases] = await pool.query(
         `SELECT
            p.*,
            SUM(pp.total) as total,
            JSON_ARRAYAGG(JSON_OBJECT(
               'product_id', pp.product_id, 'subtotal', pp.total, 'quantity', pp.quantity ,'name', Pr.name, 'description', Pr.description, 'price', Pr.price, 'category_id', Pr.category_id
            )) as products
         FROM purchases p
         INNER JOIN purchase_products pp ON p.purchase_id = pp.purchase_id
         LEFT JOIN products Pr ON pp.product_id = Pr.product_id
         WHERE p.status=?
         GROUP BY p.purchase_id, p.purchase_date
         LIMIT ${(page - 1) * take}, ${take}`,
         [status]
      );

      return purchases;
   }

   static async count({ userId, status = true }) {
      const baseQuery = `SELECT pp.purchase_id, p.user_id, p.status FROM purchases p
         RIGHT JOIN purchase_products pp 
         ON pp.purchase_id=p.purchase_id
         GROUP BY pp.purchase_id
         HAVING p.status=?`;

      if (userId) {
         const [result] = await pool.query(
            `SELECT COUNT(*) as purchases_count FROM (${baseQuery} AND p.user_id = ?) AS subquery`,
            [status, userId]
         );
         return result[0].purchases_count;
      }

      const [result] = await pool.query(
         `SELECT COUNT(*) as purchases_count FROM (${baseQuery}) AS subquery`,
         [status]
      );
      return result[0]?.purchases_count;
   }

   static async getByUser({ userId, page = 1, take = 5, status = true }) {
      const [userPurchases] = await pool.query(
         `SELECT
            p.*,
            SUM(pp.total) as total,
            JSON_ARRAYAGG(JSON_OBJECT(
               'product_id', pp.product_id, 'subtotal', pp.total, 'quantity', pp.quantity ,'name', Pr.name, 'description', Pr.description, 'price', Pr.price, 'category_id', Pr.category_id
            )) as products
         FROM purchases p
         INNER JOIN purchase_products pp ON p.purchase_id = pp.purchase_id
         LEFT JOIN products Pr ON pp.product_id = Pr.product_id
         WHERE p.user_id=? AND p.status=?
         GROUP BY p.purchase_id, p.purchase_date
         LIMIT ${(page - 1) * take}, ${take}
      `,
         [userId, status]
      );

      return userPurchases;
   }

   static async create({ comment, status, userId, paymentType }) {
      const [result] = await pool.query(
         'INSERT INTO purchases (comment, status, user_id, payment_type) ' +
            'VALUES (?, ?, ?, ?)',
         [comment, status, userId, paymentType]
      );

      const [purchase] = await pool.query(
         'SELECT * FROM purchases WHERE purchase_id = ? ',
         [result.insertId]
      );

      return purchase[0];
   }

   static async addProducts({ purchaseProducts, purchaseId }) {
      let createManyQueryValues = '';
      for (let i = 0; i < purchaseProducts.length; i++) {
         const { productId, quantity, total } = purchaseProducts[i];
         createManyQueryValues += `(${purchaseId}, ${productId}, ${quantity}, ${total})${
            i === purchaseProducts.length - 1 ? '' : ','
         }`;
      }

      await pool.query(
         `INSERT INTO purchase_products (purchase_id, product_id, quantity, total) VALUES ${createManyQueryValues}`
      );

      const [products] = await pool.query(
         'SELECT * FROM purchase_products WHERE purchase_id = ?',
         [purchaseId]
      );
      return products;
   }
}

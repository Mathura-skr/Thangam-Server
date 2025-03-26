import { pool } from '../config/database.js';

export class UserModel {
   static async getByEmail(email) {
      const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [
         email,
      ]);

      if (users.length === 0) return null;

      return users[0];
   }

   static async getById(userId) {
      const [users] = await pool.query(
         'SELECT user_id, first_name, last_name, mobile, address, email, is_admin FROM users WHERE user_id = ?',
         [userId]
      );

      if (users.length === 0) return null;

      return users[0];
   }

   static async create(user) {
      try {
         console.log('Creating user:', user); // ✅ Logs request payload

         const [result] = await pool.query(
            'INSERT INTO users (first_name, last_name, mobile, address, email, password, is_admin) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
               user.name,
               user.mobile,
               user.address,
               user.email,
               user.password,
               user.isAdmin ?? false, // Default to false
            ]
         );

         console.log('Insert Result:', result); // ✅ Logs SQL response

         const [users] = await pool.query(
            'SELECT user_id, first_name, last_name, mobile, address, email FROM users WHERE user_id = ?',
            [result.insertId]
         );

         return users[0];
      } catch (error) {
         console.error('Database Error (createUser):', error);
         throw error;
      }
   }
}

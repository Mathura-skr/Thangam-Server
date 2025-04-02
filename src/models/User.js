const { pool } = require('../config/database');

class UserModel {
   static async getByEmail(email) {
      const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

      if (users.length === 0) return null;

      return users[0];
   }

   static async getById(userId) {
      const [users] = await pool.query(
         'SELECT id, name, email, phone, image, isAdmin, role, created_at FROM users WHERE id = ?',
         [userId]
      );

      if (users.length === 0) return null;

      return users[0];
   }

   static async create(user) {
      const [result] = await pool.query(
         'INSERT INTO users (name, email, password, phone, image, isAdmin, role) ' +
         'VALUES (?, ?, ?, ?, ?, ?, ?)',
         [
            user.name,
            user.email,
            user.password,
            user.phone,
            user.image,
            user.isAdmin,
            user.role,
         ]
      );

      const [users] = await pool.query(
         'SELECT id, name, email, phone, image, isAdmin, role, created_at FROM users WHERE id = ?',
         [result.insertId]
      );

      return users[0];
   }
}

module.exports = UserModel;

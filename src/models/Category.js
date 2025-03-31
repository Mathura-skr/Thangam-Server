const db = require('../config/database');

const Category = {
   createTable: async () => {
       const sql = `
           CREATE TABLE IF NOT EXISTS categories (
               id INT AUTO_INCREMENT PRIMARY KEY,
               name VARCHAR(255) NOT NULL
           )
       `;
       await db.execute(sql);
   }
};

module.exports =  Category;
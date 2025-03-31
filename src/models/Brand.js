const db = require('../config/database');

const Brand = {
    createTable: async () => {
        const sql = `
            CREATE TABLE IF NOT EXISTS brands (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await db.execute(sql);
    }
};

module.exports =  Brand;

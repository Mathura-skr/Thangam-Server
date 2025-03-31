const db = require('../config/database');

const Supplier = {
    createTable: async () => {
        const sql = `
            CREATE TABLE IF NOT EXISTS suppliers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                contact VARCHAR(255) NOT NULL
            )
        `;
        await db.execute(sql);
    }
};

module.exports =  Supplier;
const db = require('../config/database');

const Address = {
    createTable: async () => {
        const sql = `
            CREATE TABLE IF NOT EXISTS addresses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                street VARCHAR(255),
                city VARCHAR(100),
                province VARCHAR(100),
                zip_code VARCHAR(20),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        await db.execute(sql);
    }
};

module.exports =  Address;
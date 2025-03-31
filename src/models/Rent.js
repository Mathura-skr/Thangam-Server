const db = require('../config/database');

const Rent = {
    createTable: async () => {
        const sql = `
            CREATE TABLE IF NOT EXISTS rent (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                product_id INT,
                rent_price DECIMAL(10,2) NOT NULL,
                duration INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )
        `;
        await db.execute(sql);
    }
};


module.exports =  Rent;
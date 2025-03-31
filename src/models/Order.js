const db = require('../config/database');

const Order = {
    createTable: async () => {
        const sql = `
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                total_price DECIMAL(10,2) NOT NULL,
                status ENUM('pending', 'shipped', 'delivered') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        await db.execute(sql);
    }
};

module.exports =  Order;
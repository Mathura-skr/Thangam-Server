const db = require('../config/database');

const Product = {
    createTable: async () => {
        const sql = `
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                brand_id INT,
                category ENUM('Fertilizer', 'Tools') NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                stock INT DEFAULT 0,
                expiry_date DATE NULL,
                packet_quantity VARCHAR(50) NULL,
                sub_category VARCHAR(255) NULL,
                image VARCHAR(500),  -- New column for product image URL
                FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL
            )
        `;
        await db.execute(sql);
    }
};

module.exports =  Product;
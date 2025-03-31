const db = require('../config/database');

const Review = {
    createTable: async () => {
        const sql = `
            CREATE TABLE IF NOT EXISTS reviews (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                product_id INT,
                rating INT CHECK (rating BETWEEN 1 AND 5),
                comment TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )
        `;
        await db.execute(sql);
    }
};

module.exports =  Review;
const db = require('../config/database');


const Favourite = {
    createTable: async () => {
        const sql = `
            CREATE TABLE IF NOT EXISTS favourites (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                product_id INT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )
        `;
        await db.execute(sql);
    }
};

module.exports =  Favourite;
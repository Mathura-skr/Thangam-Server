const pool = require('./database');

const createTables = async () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        image VARCHAR(255),
        isVerified BOOLEAN DEFAULT FALSE,
        isAdmin BOOLEAN DEFAULT FALSE,
        role ENUM('admin', 'user', 'staff') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

     
    CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

    try {
        const connection = await pool.getConnection();  // ✅ Get connection
        await connection.query(sql);  // ✅ Execute query
        connection.release();  // ✅ Release connection
        console.log("✅ Tables created or already exist");
    } catch (error) {
        console.error("❌ MySQL Table Creation Error:", error.message);
    }
};

module.exports = createTables;

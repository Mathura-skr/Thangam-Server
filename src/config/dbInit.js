const { pool } = require("./database");

const createTables = async () => {
  const userTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        image_url VARCHAR(255),
        isAdmin BOOLEAN DEFAULT FALSE,
        role ENUM('admin', 'user', 'staff') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

  const addressTable = `
    CREATE TABLE IF NOT EXISTS addresses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        street VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        district VARCHAR(100) NOT NULL,
        province VARCHAR(100) NOT NULL,
        zip_code VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`;

  const categoryTable = `
    CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

  const subcategoryTable = `
    CREATE TABLE IF NOT EXISTS subcategories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );`;

  const brandTable = `
    CREATE TABLE IF NOT EXISTS brands (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

  const supplierTable = `
    CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,       
    product_name VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    quantity INT DEFAULT 0,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

  const productTable = `
    CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        category_id INT NOT NULL,
        subcategory_id INT NOT NULL,
        supplier_id INT NOT NULL,
        brand_id INT NOT NULL,
        quantity INT DEFAULT NULL,
        price DECIMAL(10, 2) NOT NULL,
        stock INT NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
        FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE CASCADE,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
        FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
    );`;

  const cartTable = `
    CREATE TABLE IF NOT EXISTS carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    paymentMode VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);`;

  const orderTable = `
    CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    address_id INT NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    paymentMode VARCHAR(50),
    status ENUM('pending', 'shipped', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE CASCADE
);`;

  const reviewTable = `
    CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
    );`;

  const favouritesTable = `
    CREATE TABLE IF NOT EXISTS favourites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
    );`;

  try {
    const connection = await pool.getConnection();

    console.log("✅ Connection established to MySQL");

    await connection.query(userTable);
    await connection.query(addressTable);
    await connection.query(categoryTable);
    await connection.query(subcategoryTable);
    await connection.query(brandTable);
    await connection.query(supplierTable);
    await connection.query(productTable);
    await connection.query(cartTable);
    await connection.query(orderTable);
    await connection.query(reviewTable);
    await connection.query(favouritesTable);

    connection.release();
    console.log("✅ All tables created or already exist");
  } catch (error) {
    console.error("❌ MySQL Table Creation Error:", error.message);
  }
  //TODO: env
  const adminEmail = "admin@thangam.com";
  const adminPassword = "admin123";
  const isAdmin = 1;
  const bcrypt = require("bcrypt");

  try {
    const [existingAdmin] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND role = 'admin'",
      [adminEmail]
    );

    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await pool.query(
        "INSERT INTO users (name, email, password, role, isAdmin) VALUES (?, ?, ?, ?, ?)",
        ["Admin", adminEmail, hashedPassword, "admin", isAdmin]
      );

      console.log("✅ Initial admin created:", adminEmail);
    } else {
      console.log("ℹ️ Admin already exists:", adminEmail);
    }
  } catch (err) {
    console.error("❌ Failed to create initial admin:", err.message);
  }
};

module.exports = createTables;

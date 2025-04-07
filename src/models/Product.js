const { pool } = require("../config/database");

class Product {
  static async create(productData) {
    const {
      name,
      description,
      category_name,
      subcategory_name,
      supplier_name,
      brand_name,
      quantity,
      price,
      stock,
      image_url
    } = productData;

    const [existingCategory] = await pool.execute(
      "SELECT id FROM categories WHERE name = ?",
      [category_name]
    );
    let category_id;
    if (existingCategory.length === 0) {
      const [categoryResult] = await pool.execute(
        "INSERT INTO categories (name) VALUES (?)",
        [category_name]
      );
      category_id = categoryResult.insertId;
    } else {
      category_id = existingCategory[0].id;
    }

    const [existingSubcategory] = await pool.execute(
      "SELECT id FROM subcategories WHERE name = ? AND category_id = ?",
      [subcategory_name, category_id]
    );
    let subcategory_id;
    if (existingSubcategory.length === 0) {
      const [subcategoryResult] = await pool.execute(
        "INSERT INTO subcategories (name, category_id) VALUES (?, ?)",
        [subcategory_name, category_id]
      );
      subcategory_id = subcategoryResult.insertId;
    } else {
      subcategory_id = existingSubcategory[0].id;
    }

    const [existingSupplier] = await pool.execute(
      "SELECT id FROM suppliers WHERE name = ?",
      [supplier_name]
    );
    let supplier_id;
    if (existingSupplier.length === 0) {
      const [supplierResult] = await pool.execute(
        "INSERT INTO suppliers (name, category_id) VALUES (?, ?)",
        [supplier_name, category_id]
      );
      supplier_id = supplierResult.insertId;
    } else {
      supplier_id = existingSupplier[0].id;
    }

    const [existingBrand] = await pool.execute(
      "SELECT id FROM brands WHERE name = ?",
      [brand_name]
    );
    let brand_id;
    if (existingBrand.length === 0) {
      const [brandResult] = await pool.execute(
        "INSERT INTO brands (name) VALUES (?)",
        [brand_name]
      );
      brand_id = brandResult.insertId;
    } else {
      brand_id = existingBrand[0].id;
    }

    const query = `
      INSERT INTO products (name, description, category_id, subcategory_id, supplier_id, brand_id, quantity, price, stock, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      name,
      description,
      category_id,
      subcategory_id,
      supplier_id,
      brand_id,
      quantity,
      price,
      stock,
      image_url || null
    ]);

    return { id: result.insertId, ...productData };
  }

  static async updateById(id, productData) {
    const {
      name,
      description,
      category_name,
      subcategory_name,
      supplier_name,
      brand_name,
      quantity,
      price,
      stock,
      image_url
    } = productData;

    const [existingCategory] = await pool.execute(
      "SELECT id FROM categories WHERE name = ?",
      [category_name]
    );
    let category_id;
    if (existingCategory.length === 0) {
      const [categoryResult] = await pool.execute(
        "INSERT INTO categories (name) VALUES (?)",
        [category_name]
      );
      category_id = categoryResult.insertId;
    } else {
      category_id = existingCategory[0].id;
    }

    const [existingSubcategory] = await pool.execute(
      "SELECT id FROM subcategories WHERE name = ? AND category_id = ?",
      [subcategory_name, category_id]
    );
    let subcategory_id;
    if (existingSubcategory.length === 0) {
      const [subcategoryResult] = await pool.execute(
        "INSERT INTO subcategories (name, category_id) VALUES (?, ?)",
        [subcategory_name, category_id]
      );
      subcategory_id = subcategoryResult.insertId;
    } else {
      subcategory_id = existingSubcategory[0].id;
    }

    const [existingSupplier] = await pool.execute(
      "SELECT id FROM suppliers WHERE name = ?",
      [supplier_name]
    );
    let supplier_id;
    if (existingSupplier.length === 0) {
      const [supplierResult] = await pool.execute(
        "INSERT INTO suppliers (name, category_id) VALUES (?, ?)",
        [supplier_name, category_id]
      );
      supplier_id = supplierResult.insertId;
    } else {
      supplier_id = existingSupplier[0].id;
    }

    const [existingBrand] = await pool.execute(
      "SELECT id FROM brands WHERE name = ?",
      [brand_name]
    );
    let brand_id;
    if (existingBrand.length === 0) {
      const [brandResult] = await pool.execute(
        "INSERT INTO brands (name) VALUES (?)",
        [brand_name]
      );
      brand_id = brandResult.insertId;
    } else {
      brand_id = existingBrand[0].id;
    }

    const query = `
      UPDATE products
      SET name = ?, description = ?, category_id = ?, subcategory_id = ?, supplier_id = ?, brand_id = ?, quantity = ?, price = ?, stock = ?, image_url = ?
      WHERE id = ?
    `;
    await pool.execute(query, [
      name,
      description,
      category_id,
      subcategory_id,
      supplier_id,
      brand_id,
      quantity !== undefined ? quantity : null,
      price,
      stock,
      image_url || null,
      id
    ]);

    return { id, ...productData };
  }

  static async deleteById(id) {
    const query = `DELETE FROM products WHERE id = ?`;
    await pool.execute(query, [id]);
    return { message: "Product deleted successfully" };
  }

  static async getById(id) {
    const query = `
      SELECT 
        p.id, p.name, p.description, p.quantity, p.price, p.stock, p.image_url,
        c.name AS category_name,
        sc.name AS subcategory_name,
        s.name AS supplier_name,
        b.name AS brand_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN subcategories sc ON p.subcategory_id = sc.id
      JOIN suppliers s ON p.supplier_id = s.id
      JOIN brands b ON p.brand_id = b.id
      WHERE p.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0]; 
  
  }

  static async getAll() {
    const [rows] = await pool.execute(`
      SELECT p.*, c.name as category, s.name as subCategory, b.name as brand 
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN subcategories s ON p.subcategory_id = s.id
      JOIN brands b ON p.brand_id = b.id
    `);
    return rows;
  }
  
  
}

module.exports = Product;

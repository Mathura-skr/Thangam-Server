const { pool } = require("../config/database");

class Product {
  // Create a new product
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
    } = productData;

    // Check or insert category
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

    // Check or insert subcategory
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

    // ✅ Check or insert supplier
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

    // ✅ Check or insert brand
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

    // ✅ Insert product
    const query = `
            INSERT INTO products (name, description, category_id, subcategory_id, supplier_id, brand_id, quantity, price, stock) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    ]);

    return { id: result.insertId, ...productData };
  }

  // Get all products
  static async getAll() {
    const query = `
        SELECT 
            p.id, 
            p.name, 
            p.description, 
            c.name AS category, 
            s.name AS subCategory, 
            sup.name AS supplier, 
            b.name AS brand, 
            p.quantity, 
            p.price, 
            p.stock 
        FROM products p 
        JOIN categories c ON p.category_id = c.id 
        JOIN subcategories s ON p.subcategory_id = s.id
        JOIN suppliers sup ON p.supplier_id = sup.id
        JOIN brands b ON p.brand_id = b.id
    `;
    const [results] = await pool.execute(query);
    return results;
  }

  // Get a product by ID
  static async getById(id) {
    const query = `
        SELECT 
            p.id, 
            p.name, 
            p.description, 
            c.name AS category, 
            s.name AS subCategory, 
            sup.name AS supplier, 
            b.name AS brand, 
            p.quantity, 
            p.price, 
            p.stock 
        FROM products p 
        JOIN categories c ON p.category_id = c.id 
        JOIN subcategories s ON p.subcategory_id = s.id
        JOIN suppliers sup ON p.supplier_id = sup.id
        JOIN brands b ON p.brand_id = b.id
        WHERE p.id = ?
    `;
    const [results] = await pool.execute(query, [id]);
    if (results.length === 0) return null;
    return results[0];
  }

  // Update a product by ID
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
    } = productData;

    // Check if the category exists; if not, insert it
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
      category_id = categoryResult.insertId; // New category_id
    } else {
      category_id = existingCategory[0].id; // Use existing category_id
    }

    // Check if the subcategory exists for the category; if not, insert it
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
      subcategory_id = subcategoryResult.insertId; // New subcategory_id
    } else {
      subcategory_id = existingSubcategory[0].id; // Use existing subcategory_id
    }

    // Update supplier
    const [existingSupplier] = await pool.execute(
      "SELECT id FROM suppliers WHERE name = ?",
      [supplier_name]
    );
    let supplier_id =
      existingSupplier.length === 0
        ? (
            await pool.execute("INSERT INTO suppliers (name) VALUES (?)", [
              supplier_name,
            ])
          )[0].insertId
        : existingSupplier[0].id;

    // Update brand
    const [existingBrand] = await pool.execute(
      "SELECT id FROM brands WHERE name = ?",
      [brand_name]
    );
    let brand_id =
      existingBrand.length === 0
        ? (
            await pool.execute("INSERT INTO brands (name) VALUES (?)", [
              brand_name,
            ])
          )[0].insertId
        : existingBrand[0].id;

    // Update the product in the products table
    const query = `UPDATE products SET name = ?, description = ?, category_id = ?, subcategory_id = ?, supplier_id = ?, brand_id = ?, quantity = ?, price = ?, stock = ? WHERE id = ?`;
    await pool.execute(query, [
      name,
      description,
      category_id,
      subcategory_id,
      supplier_id,
      brand_id,
      quantity,
      price,
      stock,
      id,
    ]);

    return { id, ...productData };
  }

  // Delete a product by ID
  static async deleteById(id) {
    const query = `DELETE FROM products WHERE id = ?`;
    await pool.execute(query, [id]);
    return { message: "Product deleted successfully" };
  }
}

module.exports = Product;

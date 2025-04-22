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
      image_url,
      manufactured_date,
      expiry_date
    } = productData;

    console.log('Incoming quantity:', quantity);
    console.log('Category:', category_name);

    // Get or create category
    const [existingCategory] = await pool.execute(
      "SELECT id FROM categories WHERE name = ?",
      [category_name]
    );
    let category_id = existingCategory.length
      ? existingCategory[0].id
      : (await pool.execute("INSERT INTO categories (name) VALUES (?)", [category_name]))[0].insertId;

    // Get or create subcategory
    const [existingSubcategory] = await pool.execute(
      "SELECT id FROM subcategories WHERE name = ? AND category_id = ?",
      [subcategory_name, category_id]
    );
    let subcategory_id = existingSubcategory.length
      ? existingSubcategory[0].id
      : (await pool.execute(
          "INSERT INTO subcategories (name, category_id) VALUES (?, ?)",
          [subcategory_name, category_id]
        ))[0].insertId;

    // Get or create supplier
    const [existingSupplier] = await pool.execute(
      "SELECT id FROM suppliers WHERE name = ?",
      [supplier_name]
    );
    let supplier_id = existingSupplier.length
      ? existingSupplier[0].id
      : (await pool.execute(
          `INSERT INTO suppliers (name, category, product_name, brand) VALUES (?, ?, ?, ?)`,
          [supplier_name, category_name, name, brand_name]
        ))[0].insertId;

    // Get or create brand
    const [existingBrand] = await pool.execute(
      "SELECT id FROM brands WHERE name = ?",
      [brand_name]
    );
    let brand_id = existingBrand.length
      ? existingBrand[0].id
      : (await pool.execute("INSERT INTO brands (name) VALUES (?)", [brand_name]))[0].insertId;

    // Validate fertilizer quantity
    if (category_name.toLowerCase() === 'fertilizer') {
      if (!quantity || isNaN(Number(quantity))) {
        throw new Error(`Quantity is required and must be numeric for fertilizer. Received: ${quantity}`);
      }
    }

    const finalQuantity = category_name.toLowerCase() === 'fertilizer' ? Number(quantity) : null;

    // Insert product
    const [result] = await pool.execute(
      `INSERT INTO products 
      (name, description, category_id, subcategory_id, supplier_id, brand_id, quantity, price, stock, image_url, manufactured_date, expiry_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description,
        category_id,
        subcategory_id,
        supplier_id,
        brand_id,
        finalQuantity,
        price,
        stock,
        image_url || null,
        manufactured_date || null,
        expiry_date || null
      ]
    );

    return { id: result.insertId, ...productData, quantity: finalQuantity };
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
      image_url,
      manufactured_date,
      expiry_date
    } = productData;
  
    // Resolve category
    const [existingCategory] = await pool.execute(
      "SELECT id FROM categories WHERE name = ?",
      [category_name]
    );
    const category_id = existingCategory.length
      ? existingCategory[0].id
      : (await pool.execute("INSERT INTO categories (name) VALUES (?)", [category_name]))[0].insertId;
  
    // Resolve subcategory
    const [existingSubcategory] = await pool.execute(
      "SELECT id FROM subcategories WHERE name = ? AND category_id = ?",
      [subcategory_name, category_id]
    );
    const subcategory_id = existingSubcategory.length
      ? existingSubcategory[0].id
      : (await pool.execute(
          "INSERT INTO subcategories (name, category_id) VALUES (?, ?)",
          [subcategory_name, category_id]
        ))[0].insertId;
  
    // Resolve supplier
    const [existingSupplier] = await pool.execute(
      "SELECT id FROM suppliers WHERE name = ?",
      [supplier_name]
    );
    const supplier_id = existingSupplier.length
      ? existingSupplier[0].id
      : (await pool.execute(
          `INSERT INTO suppliers (name, category, product_name, brand) VALUES (?, ?, ?, ?)`,
          [supplier_name, category_name, name, brand_name]
        ))[0].insertId;
  
    // Resolve brand
    const [existingBrand] = await pool.execute(
      "SELECT id FROM brands WHERE name = ?",
      [brand_name]
    );
    const brand_id = existingBrand.length
      ? existingBrand[0].id
      : (await pool.execute("INSERT INTO brands (name) VALUES (?)", [brand_name]))[0].insertId;
  
    // Determine final quantity
    const finalQuantity = category_name.toLowerCase() === "fertilizer" && quantity
      ? Number(quantity)
      : null;
  
    // Prepare image URL
    const finalImageUrl = Array.isArray(image_url)
      ? (image_url.length > 0 ? image_url[0] : null)
      : image_url || null;
  
    // Prepare date strings
    const prepareDate = (date) => date ? new Date(date).toISOString().split('T')[0] : null;
  
    // SQL Query
    const query = `
      UPDATE products SET
        name = ?, description = ?, category_id = ?, subcategory_id = ?, 
        supplier_id = ?, brand_id = ?, quantity = ?, price = ?, 
        stock = ?, image_url = ?, manufactured_date = ?, expiry_date = ?
      WHERE id = ?
    `;
  
    const params = [
      name,
      description,
      category_id,
      subcategory_id,
      supplier_id,
      brand_id,
      finalQuantity,
      price,
      stock,
      finalImageUrl,
      prepareDate(manufactured_date),
      prepareDate(expiry_date),
      id
    ];
  
    await pool.execute(query, params);
  
    return { message: "Product updated successfully", id, ...productData, quantity: finalQuantity };
  }
  
  

  static async deleteById(id) {
    await pool.execute("DELETE FROM products WHERE id = ?", [id]);
    return { message: "Product deleted successfully" };
  }

  static async getById(id) {
    const query = `
      SELECT 
        p.id, p.name, p.description, p.quantity, p.price, p.stock, p.image_url, 
        p.manufactured_date, p.expiry_date,
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
      SELECT 
        p.*, 
        c.name AS category, 
        sc.name AS subCategory, 
        b.name AS brand,
        sp.name AS supplier
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN subcategories sc ON p.subcategory_id = sc.id
      JOIN brands b ON p.brand_id = b.id
      JOIN suppliers sp ON p.supplier_id = sp.id
    `);
    return rows.map(row => ({
      ...row,
      quantity: row.quantity !== null ? row.quantity : undefined
    }));
  }

  static async getFilterOptions() {
    const [categories] = await pool.execute(`SELECT name FROM categories`);
    const [subcategories] = await pool.execute(`SELECT name FROM subcategories`);
    const [brands] = await pool.execute(`SELECT name FROM brands`);
    const [quantities] = await pool.execute(`SELECT DISTINCT quantity FROM products WHERE quantity IS NOT NULL`);
  
    return {
      categories: categories.map(c => c.name),
      subcategories: subcategories.map(sc => sc.name),
      brands: brands.map(b => b.name),
      quantities: quantities.map(q => q.quantity)
    };
  }
}

module.exports = Product;

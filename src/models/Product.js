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
      expiry_date,
      discount,
      
    } = productData;

    const discount_price = discount
    ? Number((price - (price * discount) / 100).toFixed(2))
    : null;


    const [existingCategory] = await pool.execute(
      "SELECT id FROM categories WHERE name = ?",
      [category_name]
    );
    let category_id = existingCategory.length
      ? existingCategory[0].id
      : (await pool.execute("INSERT INTO categories (name) VALUES (?)", [category_name]))[0].insertId;

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

    const [existingBrand] = await pool.execute(
      "SELECT id FROM brands WHERE name = ?",
      [brand_name]
    );
    let brand_id = existingBrand.length
      ? existingBrand[0].id
      : (await pool.execute("INSERT INTO brands (name) VALUES (?)", [brand_name]))[0].insertId;

    const finalQuantity = category_name.toLowerCase() === 'fertilizer' ? Number(quantity) : null;

    const [result] = await pool.execute(
      `INSERT INTO products 
      (name, description, category_id, subcategory_id, supplier_id, brand_id, quantity, price, stock, image_url, manufactured_date, expiry_date, discount, discount_price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        expiry_date || null,
        discount || 0,
        discount_price || 0
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
      expiry_date,
      discount,
      
    } = productData;

    const discount_price = discount
    ? Number((price - (price * discount) / 100).toFixed(2))
    : null;

    const [existingCategory] = await pool.execute(
      "SELECT id FROM categories WHERE name = ?",
      [category_name]
    );
    const category_id = existingCategory.length
      ? existingCategory[0].id
      : (await pool.execute("INSERT INTO categories (name) VALUES (?)", [category_name]))[0].insertId;

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

    const [existingBrand] = await pool.execute(
      "SELECT id FROM brands WHERE name = ?",
      [brand_name]
    );
    const brand_id = existingBrand.length
      ? existingBrand[0].id
      : (await pool.execute("INSERT INTO brands (name) VALUES (?)", [brand_name]))[0].insertId;

    const finalQuantity = category_name.toLowerCase() === "fertilizer" && quantity
      ? Number(quantity)
      : null;

    const finalImageUrl = Array.isArray(image_url)
      ? (image_url.length > 0 ? image_url[0] : null)
      : image_url || null;

    const prepareDate = (date) => date ? new Date(date).toISOString().split('T')[0] : null;

    const query = `
      UPDATE products SET
        name = ?, description = ?, category_id = ?, subcategory_id = ?, 
        supplier_id = ?, brand_id = ?, quantity = ?, price = ?, 
        stock = ?, image_url = ?, manufactured_date = ?, expiry_date = ?, 
        discount = ?, discount_price = ?
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
      discount || 0,
      discount_price || 0,
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
        b.name AS brand_name,
        ROUND(AVG(r.rating), 1) AS average_rating,
        COUNT(r.id) AS review_count
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN subcategories sc ON p.subcategory_id = sc.id
      JOIN suppliers s ON p.supplier_id = s.id
      JOIN brands b ON p.brand_id = b.id
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE p.id = ?
      GROUP BY p.id
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
        sp.name AS supplier,
        ROUND(AVG(r.rating), 1) AS average_rating,
        COUNT(r.id) AS review_count
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN subcategories sc ON p.subcategory_id = sc.id
      JOIN brands b ON p.brand_id = b.id
      JOIN suppliers sp ON p.supplier_id = sp.id
      LEFT JOIN reviews r ON p.id = r.product_id
      GROUP BY p.id
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

  static async getRelatedProducts(category, excludeId) {
    const query = `
      SELECT 
        p.id, p.name, 
        CAST(p.price AS DECIMAL(10,2)) as price,
        p.image_url
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE c.name = ? AND p.id != ?
      LIMIT 4
    `;
    const [rows] = await pool.execute(query, [category, excludeId]);
    return rows;
  }
  
  static async searchByName(query) {
  const searchTerm = `%${query}%`;
  const [rows] = await pool.execute(
    `
    SELECT 
      p.id, p.name, p.price, p.image_url,
      c.name AS category,
      sc.name AS subCategory,
      b.name AS brand,
      sp.name AS supplier
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN subcategories sc ON p.subcategory_id = sc.id
    JOIN brands b ON p.brand_id = b.id
    JOIN suppliers sp ON p.supplier_id = sp.id
    WHERE p.name LIKE ?
    `,
    [searchTerm]
  );

  return rows;
}

  
}

module.exports = Product;

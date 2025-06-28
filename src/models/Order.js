const { pool } = require("../config/database");

class OrderModel {
  static async create(order) {
    const {
      user_id,
      product_id,
      address_id,
      unit,
      total_price,
      status,
      paymentMode,
    } = order;
    const [result] = await pool.query(
      "INSERT INTO orders (user_id, product_id, address_id, unit, total_price, status, paymentMode) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [user_id, product_id, address_id, unit, total_price, status, paymentMode]
    );
    return { id: result.insertId, ...order };
  }

  static async getByUserId(userId) {
    const [orders] = await pool.query(
      "SELECT * FROM orders WHERE user_id = ?",
      [userId]
    );
    return orders;
  }

  static async getAll(page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  const [orders] = await pool.query(`
    SELECT o.*, 
      CONCAT(
        IFNULL(a.street, ''), ', ', 
        IFNULL(a.city, ''), ', ', 
        IFNULL(a.district, ''), ', ', 
        IFNULL(a.province, ''), ', ', 
        IFNULL(a.zip_code, '')
      ) AS full_address
    FROM orders o
    LEFT JOIN addresses a 
      ON o.address_id = a.id 
      AND a.address_type = 'delivery'  
    ORDER BY o.id DESC
    LIMIT ? OFFSET ?
  `, [limit, offset]);

  const [total] = await pool.query("SELECT COUNT(*) AS total FROM orders");

  return {
    total: total[0].total,
    orders: orders.map(order => ({
      ...order,
      full_address: order.full_address || "No delivery address"
    })),
  };
}

 static async updateById(id, updatedFields) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Get current order state
      const [currentOrder] = await connection.query(
        "SELECT status, product_id, unit FROM orders WHERE id = ?",
        [id]
      );
      
      if (currentOrder.length === 0) {
        throw new Error("Order not found");
      }

      const { status: oldStatus, product_id, unit } = currentOrder[0];

      // Prevent cancellation if order is shipped
      if (
        updatedFields.status &&
        updatedFields.status.toLowerCase() === "cancelled" &&
        oldStatus && oldStatus.toLowerCase() === "shipped"
      ) {
        const error = new Error("Shipped orders cannot be cancelled.");
        error.status = 400;
        error.code = "ORDER_SHIPPED_CANNOT_CANCEL";
        throw error;
      }

      // Update order
      const fields = Object.keys(updatedFields);
      const values = Object.values(updatedFields);
      const setClause = fields.map((field) => `\`${field}\` = ?`).join(", ");
      
      await connection.query(
        `UPDATE orders SET ${setClause} WHERE id = ?`,
        [...values, id]
      );

      // Handle inventory for completed orders
      if (updatedFields.status === "completed" && oldStatus !== "completed") {
        const [product] = await connection.query(
          "SELECT stock FROM products WHERE id = ?",
          [product_id]
        );

        if (product.length === 0) throw new Error("Product not found");
        
        const newStock = product[0].stock - unit;
        if (newStock < 0) throw new Error("Insufficient stock");

        await connection.query(
          "UPDATE products SET stock = ? WHERE id = ?",
          [newStock, product_id]
        );
      }

      // Get updated order
      const [updatedOrder] = await connection.query(
        "SELECT * FROM orders WHERE id = ?",
        [id]
      );

      await connection.commit();
      return updatedOrder[0] || null;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }


 static async getSalesSummary() {
  const [rows] = await pool.query(`
    SELECT 
      o.product_id,
      p.name AS product_name,
      c.name AS category,
      sc.name AS subCategory,
      SUM(o.unit) AS total_units,
      SUM(o.total_price) AS total_sales
    FROM orders o
    JOIN products p ON o.product_id = p.id
    JOIN categories c ON p.category_id = c.id
    JOIN subcategories sc ON p.subcategory_id = sc.id
    WHERE o.status = 'completed'
    GROUP BY o.product_id
    ORDER BY total_units DESC
  `);
  return rows;
}

static async getMonthlySalesSummary() {
  const [rows] = await pool.query(`
    SELECT 
      DATE_FORMAT(created_at, '%Y-%m') AS month,
      SUM(unit) AS total_units,
      SUM(total_price) AS total_sales
    FROM orders
    WHERE status = 'completed'
    GROUP BY month
    ORDER BY month DESC
    LIMIT 12
  `);
  return rows;
}

static async getQuarterlySalesSummary() {
  const [rows] = await pool.query(`
    SELECT 
      CONCAT(YEAR(created_at), '-Q', QUARTER(created_at)) AS quarter,
      SUM(unit) AS total_units,
      SUM(total_price) AS total_sales
    FROM orders
    WHERE status = 'completed'
    GROUP BY quarter
    ORDER BY quarter DESC
    LIMIT 8
  `);
  return rows;
}

static async getAnnualSalesSummary() {
  const [rows] = await pool.query(`
    SELECT 
      YEAR(created_at) AS year,
      SUM(unit) AS total_units,
      SUM(total_price) AS total_sales
    FROM orders
    WHERE status = 'completed'
    GROUP BY year
    ORDER BY year DESC
    LIMIT 5
  `);
  return rows;
}

static async cancelOrderById(id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      // Get current order state
      const [orderRows] = await connection.query(
        'SELECT status, product_id, unit FROM orders WHERE id = ?',
        [id]
      );
      if (orderRows.length === 0) {
        throw new Error('Order not found');
      }
      const { status, product_id, unit } = orderRows[0];
      if (status === 'completed' || status === 'cancelled') {
        // Cannot cancel completed or already cancelled orders
        await connection.rollback();
        return null;
      }
      // Update order status to cancelled
      await connection.query(
        'UPDATE orders SET status = ? WHERE id = ?',
        ['cancelled', id]
      );
      // Optionally, restock inventory if needed (if order was paid)
      // (Uncomment if you want to restock)
      await connection.query(
        'UPDATE products SET stock = stock + ? WHERE id = ?',
        [unit, product_id]
      );
      
      // Get updated order
      const [updatedOrder] = await connection.query(
        'SELECT * FROM orders WHERE id = ?',
        [id]
      );
      await connection.commit();
      return updatedOrder[0] || null;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }



}

module.exports = OrderModel;

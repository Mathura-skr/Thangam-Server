const db = require('../config/database');

// Create a new order
exports.createOrder = async (req, res) => {
  const { user_id, total_price, status } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)',
      [user_id, total_price, status || 'pending']
    );
    res.status(201).json({ message: 'Order created', orderId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  const orderId = req.params.id;
  try {
    const [rows] = await db.execute('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
};

// Get all orders for a specific user
exports.getOrdersByUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const [rows] = await db.execute('SELECT * FROM orders WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;
  try {
    await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    res.json({ message: 'Order status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  const orderId = req.params.id;
  try {
    await db.execute('DELETE FROM orders WHERE id = ?', [orderId]);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

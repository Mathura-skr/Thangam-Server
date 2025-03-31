const db = require('../config/database');



// Add a product to the cart
exports.addToCart = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
      [user_id, product_id, quantity || 1]
    );
    res.status(201).json({ message: 'Product added to cart', cartId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
};

// Get cart items for a user
exports.getCartByUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const [rows] = await db.execute('SELECT * FROM cart WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve cart' });
  }
};

// Update a cart item (e.g., change quantity)
exports.updateCartItem = async (req, res) => {
  const cartId = req.params.id;
  const { quantity } = req.body;
  try {
    await db.execute('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, cartId]);
    res.json({ message: 'Cart item updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

// Delete a cart item
exports.deleteCartItem = async (req, res) => {
  const cartId = req.params.id;
  try {
    await db.execute('DELETE FROM cart WHERE id = ?', [cartId]);
    res.json({ message: 'Cart item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete cart item' });
  }
};

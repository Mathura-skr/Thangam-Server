const db = require('../config/database');


// Create a new review
exports.createReview = async (req, res) => {
  const { user_id, product_id, rating, comment } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
      [user_id, product_id, rating, comment]
    );
    res.status(201).json({ message: 'Review created', reviewId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

// Get reviews for a product
exports.getReviewsByProduct = async (req, res) => {
  const productId = req.params.productId;
  try {
    const [rows] = await db.execute('SELECT * FROM reviews WHERE product_id = ?', [productId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve reviews' });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const { rating, comment } = req.body;
  try {
    await db.execute('UPDATE reviews SET rating = ?, comment = ? WHERE id = ?', [rating, comment, reviewId]);
    res.json({ message: 'Review updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update review' });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  try {
    await db.execute('DELETE FROM reviews WHERE id = ?', [reviewId]);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

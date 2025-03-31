const db = require('../config/database');


// Add a product to favourites
exports.addFavourite = async (req, res) => {
  const { user_id, product_id } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO favourites (user_id, product_id) VALUES (?, ?)',
      [user_id, product_id]
    );
    res.status(201).json({ message: 'Favourite added', favouriteId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add favourite' });
  }
};

// Get all favourites for a user
exports.getFavouritesByUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const [rows] = await db.execute('SELECT * FROM favourites WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve favourites' });
  }
};

// Remove a product from favourites
exports.deleteFavourite = async (req, res) => {
  const favouriteId = req.params.id;
  try {
    await db.execute('DELETE FROM favourites WHERE id = ?', [favouriteId]);
    res.json({ message: 'Favourite removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove favourite' });
  }
};

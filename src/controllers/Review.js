const { pool } = require('../config/database');  
exports.create = async (req, res) => {
    try {
        const { user_id, product_id, rating, comment } = req.body;

        // Step 1: Check if the product exists
        const [productResult] = await pool.execute('SELECT id FROM products WHERE id = ?', [product_id]);

        if (productResult.length === 0) {
            return res.status(400).json({ message: 'Product not found' });
        }

        // Step 2: If the product exists, insert the review
        const query = 'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)';
        const [result] = await pool.execute(query, [user_id, product_id, rating, comment]);

        res.status(201).json({
            id: result.insertId,
            user_id,
            product_id,
            rating,
            comment
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error posting review, please try again later' });
    }
};


exports.getByProductId = async (req, res) => {
    try {
        const { id } = req.params;
        let skip = 0;
        let limit = 0;

        // Validate pagination parameters
        const pageSize = parseInt(req.query.limit, 10);
        const page = parseInt(req.query.page, 10);

        if (page && pageSize) {
            skip = pageSize * (page - 1);
            limit = pageSize;
        } else {
            // Default to no pagination if the page/limit is not provided
            limit = 10; // Set a reasonable default limit
        }

        // First, check if the product exists in the database
        const [productResult] = await pool.execute('SELECT id FROM products WHERE id = ?', [id]);

        if (productResult.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Get the total count of reviews for the product
        const [totalDocs] = await pool.execute('SELECT COUNT(*) as count FROM reviews WHERE product_id = ?', [id]);
        const totalCount = totalDocs[0].count;

        // Get the reviews for the product with user info
        const [reviews] = await pool.execute(
            `SELECT r.id, r.user_id, r.product_id, r.rating, r.comment, 
            u.name AS user_name, u.email AS user_email 
            FROM reviews r
            JOIN users u ON r.user_id = u.id 
            WHERE r.product_id = ? 
            LIMIT ? OFFSET ?`,
            [id, limit, skip]
        );

        // If there are no reviews, return a message with pagination info
        if (reviews.length === 0) {
            return res.status(200).json({ message: 'No reviews yet for this product.', reviews: [] });
        }

        // Send the reviews with pagination info
        res.set('X-total-Count', totalCount);
        res.status(200).json({ reviews, pagination: { totalCount, limit, page } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting reviews for this product, please try again later' });
    }
};



exports.updateById = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        if (!rating || !comment) {
            return res.status(400).json({ message: "Both rating and comment are required." });
        }

        // Update the review with the new data
        const query = `
            UPDATE reviews
            SET rating = ?, comment = ?
            WHERE id = ?
        `;
        const [result] = await pool.execute(query, [rating, comment, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Return the updated review
        res.status(200).json({ id, rating, comment });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating review, please try again later" });
    }
};

exports.deleteById = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the review by ID
        const query = `DELETE FROM reviews WHERE id = ?`;
        const [result] = await pool.execute(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting review, please try again later" });
    }
};

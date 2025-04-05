const { pool } = require('../config/database');  // Database connection pool

class Review {
    // Create a new review
    static async create(reviewData) {
        const { user_id, product_id, rating, comment } = reviewData;

        const query = `
            INSERT INTO reviews (user_id, product_id, rating, comment)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await pool.execute(query, [user_id, product_id, rating, comment]);
        
        return { id: result.insertId, ...reviewData };
    }

    // Get all reviews for a product
    static async getByProductId(productId, limit = 10, offset = 0) {
        const query = `
            SELECT r.*, u.name AS user_name 
            FROM reviews r 
            JOIN users u ON r.user_id = u.id
            WHERE r.product_id = ? 
            LIMIT ? OFFSET ?
        `;
        const [reviews] = await pool.execute(query, [productId, limit, offset]);
        return reviews;
    }

    // Get total count of reviews for a product
    static async getTotalCount(productId) {
        const query = 'SELECT COUNT(*) AS total FROM reviews WHERE product_id = ?';
        const [result] = await pool.execute(query, [productId]);
        return result[0].total;
    }

    // Update a review by ID
    static async updateById(id, reviewData) {
        const { rating, comment } = reviewData;

        const query = `
            UPDATE reviews 
            SET rating = ?, comment = ? 
            WHERE id = ?
        `;
        const [result] = await pool.execute(query, [rating, comment, id]);

        if (result.affectedRows === 0) {
            return null;
        }

        return { id, rating, comment };
    }

    // Delete a review by ID
    static async deleteById(id) {
        const query = 'DELETE FROM reviews WHERE id = ?';
        const [result] = await pool.execute(query, [id]);
        
        if (result.affectedRows === 0) {
            return null;
        }

        return { message: "Review deleted successfully" };
    }
}

module.exports = Review;

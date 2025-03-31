const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/Review');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, reviewController.createReview);
router.get('/product/:productId', reviewController.getReviewsByProduct);
router.put('/:id', authMiddleware, reviewController.updateReview);
router.delete('/:id', authMiddleware, reviewController.deleteReview);

module.exports =  router;

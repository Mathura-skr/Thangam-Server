const express = require('express');
const router = express.Router();
const productController = require('../controllers/Search');

// GET /api/products/search
router.get('/search', productController.searchProducts);

module.exports = router;

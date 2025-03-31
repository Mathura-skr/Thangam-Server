const express = require('express');
const router = express.Router();
const productController = require('../controllers/Product');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, productController.createProduct);
router.get('/:id', productController.getProductById);
router.get('/', productController.getAllProducts);
router.put('/:id', authMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports =  router;

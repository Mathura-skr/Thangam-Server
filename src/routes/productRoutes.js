const express = require('express');
const router = express.Router();
const productController = require('../controllers/Product');
const authMiddleware = require('../middlewares/authMiddleware');

// Define /related before /:id to avoid incorrect route matching
router.get('/related', productController.getRelated);
router.get('/:id', productController.getById);

router.post('/', authMiddleware, productController.create);
router.get('/', productController.getAll);
router.put('/:id', authMiddleware, productController.updateById);
router.delete('/:id', authMiddleware, productController.deleteById);

module.exports = router;

const express = require('express');
const router = express.Router();
const productController = require('../controllers/Product');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, productController.create);
router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.put('/:id', authMiddleware, productController.updateById);
router.delete('/:id', authMiddleware, productController.deleteById);

module.exports = router;

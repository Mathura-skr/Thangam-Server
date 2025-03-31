const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/Category');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.put('/:id', authMiddleware, categoryController.updateCategory);
router.delete('/:id', authMiddleware, categoryController.deleteCategory);

module.exports =  router;

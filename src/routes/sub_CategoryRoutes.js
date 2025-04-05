const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/Subcategory');
const authMiddleware = require('../middlewares/authMiddleware');


// Subcategory Routes
router.post('/subcategory', authMiddleware, subcategoryController.create);
router.get('/subcategory', subcategoryController.getAll);
router.get('/subcategory/category/:id', subcategoryController.getByCategoryId);
router.put('/subcategory/:id', authMiddleware, subcategoryController.updateById);
router.delete('/subcategory/:id', authMiddleware, subcategoryController.deleteById);

module.exports = router;

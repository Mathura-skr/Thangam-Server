const express = require('express');
const router = express.Router();
const brandController = require('../controllers/Brand');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, brandController.createBrand);
router.get('/', brandController.getAllBrands);
router.put('/:id', authMiddleware, brandController.updateBrand);
router.delete('/:id', authMiddleware, brandController.deleteBrand);

module.exports =  router;

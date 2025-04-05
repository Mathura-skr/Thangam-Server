const express = require('express');
const router = express.Router();
const brandController = require('../controllers/Brand');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, brandController.create);
router.get('/', brandController.getAll);
router.put('/:id', authMiddleware, brandController.updateById);
router.delete('/:id', authMiddleware, brandController.deleteById);

module.exports = router;

const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/Review');


router.post('/', ReviewController.create);
router.get('/product/:id', ReviewController.getByProductId);
router.put('/:id', ReviewController.updateById);
router.delete('/:id', ReviewController.deleteById);

module.exports = router;

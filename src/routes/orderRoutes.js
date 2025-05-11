const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/Order');


router.post('/', OrderController.create);
router.get('/user/:userId', OrderController.getByUserId);
router.get('/', OrderController.getAll);
router.get('/sales', OrderController.getSalesSummary);
router.put('/:id', OrderController.updateById);

module.exports = router;

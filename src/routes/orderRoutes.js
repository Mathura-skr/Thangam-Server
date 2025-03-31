const express = require('express');
const router = express.Router();
const orderController = require('../controllers/Order');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, orderController.createOrder);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.get('/user/:userId', authMiddleware, orderController.getOrdersByUser);
router.put('/:id', authMiddleware, orderController.updateOrderStatus);
router.delete('/:id', authMiddleware, orderController.deleteOrder);

module.exports =  router;

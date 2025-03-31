const express = require('express');
const router = express.Router();
const cartController = require('../controllers/Cart');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, cartController.addToCart);
router.get('/user/:userId', authMiddleware, cartController.getCartByUser);
router.put('/:id', authMiddleware, cartController.updateCartItem);
router.delete('/:id', authMiddleware, cartController.deleteCartItem);

module.exports =  router;

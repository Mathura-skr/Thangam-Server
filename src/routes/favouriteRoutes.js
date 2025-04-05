const express = require('express');
const router = express.Router();
const favouriteController = require('../controllers/Favourite');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, favouriteController.create);
router.get('/user/:userId', authMiddleware, favouriteController.getByUserId);
router.delete('/:id', authMiddleware, favouriteController.deleteById);

module.exports =  router;


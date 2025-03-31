const express = require('express');
const router = express.Router();
const favouriteController = require('../controllers/Favourite');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, favouriteController.addFavourite);
router.get('/user/:userId', authMiddleware, favouriteController.getFavouritesByUser);
router.delete('/:id', authMiddleware, favouriteController.deleteFavourite);

module.exports =  router;

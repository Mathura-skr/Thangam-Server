const express = require('express');
const router = express.Router();
const Category = require('../controllers/Category');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/category', authMiddleware, Category.getAll);

module.exports = router;

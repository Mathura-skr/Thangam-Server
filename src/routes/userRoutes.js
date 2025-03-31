const express = require('express');
const router = express.Router();
const userController = require('../controllers/User');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports =  router;

const express = require('express');
const router = express.Router();
const addressController = require('../controllers/Address');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, addressController.createAddress);
router.get('/user/:userId', authMiddleware, addressController.getAddressesByUser);
router.put('/:id', authMiddleware, addressController.updateAddress);
router.delete('/:id', authMiddleware, addressController.deleteAddress);

module.exports =  router;

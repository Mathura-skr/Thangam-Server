const express = require('express');
const AddressController = require('../controllers/Address');

const router = express.Router();

router.post('/', AddressController.create);
router.get('/user/:userId', AddressController.getByUserId);
router.put('/user/:userId', AddressController.updateForUser);
router.put('/:id', AddressController.updateById);
router.delete('/:id', AddressController.deleteById);

module.exports = router;

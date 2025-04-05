const express = require('express');
const router = express.Router();
const cartController = require('../controllers/Cart');

router.post('/', cartController.create);
router.get('/user/:userId', cartController.getByUserId);
router.put('/:id', cartController.updateById);
router.delete('/:id', cartController.deleteById);
router.delete('/user/:userId', cartController.deleteByUserId);

module.exports = router;

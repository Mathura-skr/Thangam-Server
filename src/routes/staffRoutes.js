const express = require('express');
const router = express.Router();
const staffController = require('../controllers/Staff');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, staffController.createStaff);
router.get('/:id', authMiddleware, staffController.getStaffById);
router.put('/:id', authMiddleware, staffController.updateStaff);
router.delete('/:id', authMiddleware, staffController.deleteStaff);

module.exports =  router;
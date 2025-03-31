const express = require('express');
const router = express.Router();
const otpController = require('../controllers/OTP');

router.post('/', otpController.createOTP);
router.post('/verify', otpController.verifyOTP);
router.delete('/:id', otpController.deleteOTP);

module.exports =  router;

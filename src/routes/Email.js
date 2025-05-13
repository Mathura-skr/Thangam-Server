// routes/email.js
const express = require("express");
const router = express.Router();
const emailController = require("../controllers/Email");

router.post("/send-invoice", emailController.sendInvoiceEmail);

module.exports = router;

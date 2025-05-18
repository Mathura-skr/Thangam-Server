const express = require("express");
const router = express.Router();
const {sendContactEmail } = require("../controllers/sendContactEmail");

router.post("/", sendContactEmail );

module.exports = router;

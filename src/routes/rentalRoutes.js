
const express = require("express");
const router = express.Router();
const RentalProduct = require("../controllers/rental");
const authMiddleware = require('../middlewares/authMiddleware');

router.post("/", authMiddleware, RentalProduct.createRentalProduct);
router.get("/", RentalProduct.getAllRentalProducts);
router.get("/:id", RentalProduct.getRentalProductById);
router.put("/:id", RentalProduct.updateRentalProduct);
router.delete("/:id",authMiddleware, RentalProduct.deleteRentalProduct);
router.put("/:id/availability", RentalProduct.updateAvailabilityStatus);

module.exports = router;

const express = require("express");
const router = express.Router();
const filterController = require("../controllers/Filter");

router.get("/categories", filterController.getCategories);
router.get("/:categoryId/subcategories", filterController.getSubCategories);
router.get("/:categoryId/brands", filterController.getBrands);
router.get("/:categoryId/sizes", filterController.getSizes);

module.exports = router;

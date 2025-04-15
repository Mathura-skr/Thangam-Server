const Filter = require("../models/Filter");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Filter.getCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

exports.getSubCategories = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subcategories = await Filter.getSubCategories(categoryId);
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch subcategories" });
  }
};

exports.getBrands = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const brands = await Filter.getBrands(categoryId);
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch brands" });
  }
};

exports.getSizes = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const sizes = await Filter.getSizes(categoryId);
    res.json(sizes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sizes" });
  }
};

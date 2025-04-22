const Product = require('../models/Product');

const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

// Function to convert a date string to ISO format (if not already)
const toISOFormat = (date) => {
  const parsedDate = new Date(date);
  return parsedDate.toISOString();
};

exports.create = async (req, res) => {
  console.log("Raw request body:", req.body);

  try {
    const {
      name,
      description,
      category_name,
      subcategory_name,
      supplier_name,
      brand_name,
      quantity,
      price,
      stock,
      image_url,
      manufactured_date,
      expiry_date
    } = req.body;

    if (
      !name ||
      !description ||
      !category_name ||
      !subcategory_name ||
      !supplier_name ||
      !brand_name ||
      price == null ||
      stock == null
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (category_name.toLowerCase() === "fertilizer" && (quantity == null || quantity === "")) {
      return res.status(400).json({ message: "Quantity is required for fertilizer" });
    }

    const finalQuantity = category_name.toLowerCase() === "fertilizer" ? quantity : null;

    if (category_name.toLowerCase() === "fertilizer") {
      if (!manufactured_date || !expiry_date) {
        return res.status(400).json({ message: "Manufactured and expiry dates are required for fertilizers" });
      }
      // Normalize dates
      const isoManufacturedDate = toISOFormat(manufactured_date);
      const isoExpiryDate = toISOFormat(expiry_date);

      // Validate the dates
      if (new Date(isoExpiryDate) <= new Date(isoManufacturedDate)) {
        return res.status(400).json({ message: "Expiry date must be after manufactured date" });
      }
    }

    if (manufactured_date && !isoDateRegex.test(toISOFormat(manufactured_date))) {
      return res.status(400).json({ message: "Manufactured date must be in ISO format" });
    }

    if (expiry_date && new Date(expiry_date) <= new Date()) {
      return res.status(400).json({ message: "Expiry date must be in the future" });
    }

    const newProduct = await Product.create({
      name,
      description,
      category_name,
      subcategory_name,
      supplier_name,
      brand_name,
      quantity: finalQuantity,
      price,
      stock,
      image_url: image_url || null,
      manufactured_date: manufactured_date ? toISOFormat(manufactured_date) : null,
      expiry_date: expiry_date ? toISOFormat(expiry_date) : null
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating product, please try again later" });
  }
};


exports.updateById = async (req, res) => {
  try {

    

    const { id } = req.params;
    const updatedFields = req.body;

    const {
      name,
      description,
      category_name,
      subcategory_name,
      supplier_name,
      brand_name,
      quantity,
      price,
      stock,
      manufactured_date,
      expiry_date
    } = updatedFields;

    if (
      !name ||
      !description ||
      !category_name ||
      !subcategory_name ||
      !supplier_name ||
      !brand_name ||
      price == null ||
      stock == null
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (category_name.toLowerCase() === "fertilizer" && (quantity == null || quantity === "")) {
      return res.status(400).json({ message: "Quantity is required for fertilizer" });
    }

    updatedFields.quantity = category_name.toLowerCase() === "fertilizer" ? quantity : null;
    updatedFields.image_url = updatedFields.image_url || null;
    updatedFields.manufactured_date = manufactured_date || null;
    updatedFields.expiry_date = expiry_date || null;

    const updatedProduct = await Product.updateById(id, updatedFields);
  
    if (updatedProduct) {
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating product, please try again later" });
  }

};

exports.getAll = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products, please try again later' });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.getById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching product details, please try again later' });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Product.deleteById(id);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting product, please try again later' });
  }
};

exports.getFilterOptions = async (req, res) => {
  try {
    const filterOptions = await Product.getFilterOptions();
    res.status(200).json(filterOptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch filter options' });
  }
};

const Product = require('../models/Product'); // Import the Product model

// Create a new product
exports.create = async (req, res) => {
    try {
        const { name, description, category_name, subcategory_name, supplier_name, brand_name, quantity, price, stock } = req.body;
        const newProduct = await Product.create({
            name,
            description,
            category_name,
            subcategory_name,
            supplier_name,
            brand_name,
            quantity,
            price,
            stock
        });

        res.status(201).json(newProduct); // Respond with the newly created product
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating product, please try again later' });
    }
};

// Get all products
exports.getAll = async (req, res) => {
    try {
        const products = await Product.getAll();
        res.status(200).json(products); // Respond with all products
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching products, please try again later' });
    }
};

// Get a product by ID
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.getById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product); // Respond with the product details
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching product details, please try again later' });
    }
};

// Update a product by ID
exports.updateById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFields = req.body;

        const updatedProduct = await Product.updateById(id, updatedFields);
        if (updatedProduct) {
            res.status(200).json(updatedProduct); // Respond with the updated product
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product, please try again later' });
    }
};

// Delete a product by ID
exports.deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await Product.deleteById(id);
        res.status(200).json(response); // Respond with success message
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product, please try again later' });
    }
};

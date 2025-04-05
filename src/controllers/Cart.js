const CartModel = require('../models/Cart'); 

// Create a new cart item
exports.create = async (req, res) => {
    try {
        const cartData = req.body;
        const createdCart = await CartModel.create(cartData);
        res.status(201).json(createdCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating cart item, please try again later' });
    }
};

// Get all cart items for a user
exports.getByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const cartItems = await CartModel.getByUserId(userId);
        res.status(200).json(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching cart items, please try again later' });
    }
};

// Update a cart item by ID
exports.updateById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFields = req.body;

        const updatedCart = await CartModel.updateById(id, updatedFields);
        if (updatedCart) {
            res.status(200).json(updatedCart);
        } else {
            res.status(404).json({ message: 'Cart item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating cart item, please try again later' });
    }
};

// Delete a cart item by ID
exports.deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await CartModel.deleteById(id);
        if (deleted) {
            res.status(200).json({ message: 'Cart item deleted successfully' });
        } else {
            res.status(404).json({ message: 'Cart item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting cart item, please try again later' });
    }
};

// Delete all cart items for a specific user
exports.deleteByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const deleted = await CartModel.deleteByUserId(userId);
        if (deleted) {
            res.status(200).json({ message: 'All cart items deleted successfully' });
        } else {
            res.status(404).json({ message: 'No cart items found for this user' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting cart items, please try again later' });
    }
};

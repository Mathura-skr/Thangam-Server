const Supplier = require('../models/Supplier');

// Create a new supplier
exports.createSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.create(req.body);
        res.status(201).json({ message: 'Supplier created successfully', supplier });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create supplier' });
    }
};

// Get all suppliers
exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.getAll();
        res.json(suppliers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve suppliers' });
    }
};

// Get supplier by ID
exports.getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.getById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.json(supplier);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve supplier' });
    }
};

// Update supplier
exports.updateSupplier = async (req, res) => {
    try {
        const updatedSupplier = await Supplier.update(req.params.id, req.body);
        if (!updatedSupplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.json({ message: 'Supplier updated successfully', updatedSupplier });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update supplier' });
    }
};

// Delete supplier
exports.deleteSupplier = async (req, res) => {
    try {
        const success = await Supplier.delete(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete supplier' });
    }
};

const express = require('express');
const router = express.Router();
const Subcategory = require('../models/Subcategory');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
    try {
        const subcategory = await Subcategory.create(req.body);
        res.status(201).json(subcategory);
    } catch (error) {
        res.status(500).json({ message: 'Error creating subcategory' });
    }
});

router.get('/', async (req, res) => {
    try {
        const subcategories = await Subcategory.getAll();
        res.status(200).json(subcategories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subcategories' });
    }
});

router.get('/category/:id', async (req, res) => {
    try {
        const subcategories = await Subcategory.getByCategoryId(req.params.id);
        res.status(200).json(subcategories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subcategories by category ID' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const result = await Subcategory.deleteById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting subcategory' });
    }
});

module.exports = router;

const CategoryModel = require('../models/Category');

const Category = {
    getAll: async (req, res) => {
        try {
            const categories = await CategoryModel.getAll();
            res.status(200).json(categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ message: 'Error fetching categories' });
        }
    }
};

module.exports = Category;

















// const express = require('express');
// const router = express.Router();
// const Category = require('../models/Category');
// const Subcategory = require('../models/Subcategory');
// const authMiddleware = require('../middlewares/authMiddleware');

// router.post('/', authMiddleware, async (req, res) => {
//     try {
//         const category = await Category.create(req.body);
//         res.status(201).json(category);
//     } catch (error) {
//         res.status(500).json({ message: 'Error creating category' });
//     }
// });

// router.get('/', async (req, res) => {
//     try {
//         const categories = await Category.getAll();
//         res.status(200).json(categories);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching categories' });
//     }
// });

// router.delete('/:id', authMiddleware, async (req, res) => {
//     try {
//         const result = await Category.deleteById(req.params.id);
//         res.status(200).json(result);
//     } catch (error) {
//         res.status(500).json({ message: 'Error deleting category' });
//     }
// });

// module.exports = router;
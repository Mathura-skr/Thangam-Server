const BrandModel = require('../models/Brand');

class BrandController {
    static async getAll(req, res) {
        try {
            const brands = await BrandModel.getAll();
            res.status(200).json(brands);
        } catch (error) {
            console.error('Error fetching brands:', error);
            res.status(500).json({ message: 'Error fetching brands' });
        }
    }

    static async create(req, res) {
        try {
            const { name, description } = req.body;
            const brand = await BrandModel.create({ name, description });
            res.status(201).json(brand);
        } catch (error) {
            console.error('Error creating brand:', error);
            res.status(500).json({ message: 'Error creating brand' });
        }
    }

    static async updateById(req, res) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            const brand = await BrandModel.updateById(id, { name, description });
            res.status(200).json(brand);
        } catch (error) {
            console.error('Error updating brand:', error);
            res.status(500).json({ message: 'Error updating brand' });
        }
    }

    static async deleteById(req, res) {
        try {
            const { id } = req.params;
            const result = await BrandModel.deleteById(id);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error deleting brand:', error);
            res.status(500).json({ message: 'Error deleting brand' });
        }
    }
}

module.exports = BrandController;

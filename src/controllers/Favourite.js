const Favourites = require('../models/Favourite');

exports.create = async (req, res) => {
    try {
        const created = await Favourites.create(req.body);
        res.status(201).json(created);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error adding product to favourites, please try again later' });
    }
};

exports.getByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const result = await Favourites.getByUserId(id, page, limit);
        res.header('X-Total-Count', result.total);
        res.status(200).json(result.favourites);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching your favourites, please try again later' });
    }
};

exports.updateById = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Favourites.updateById(id, req.body);
        if (!updated) {
            return res.status(404).json({ message: 'Favourite not found' });
        }
        res.status(200).json(updated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating your favourite, please try again later' });
    }
};

exports.deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Favourites.deleteById(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Favourite not found' });
        }
        res.status(200).json(deleted);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error deleting that product from favourites, please try again later' });
    }
};

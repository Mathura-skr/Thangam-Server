const AddressModel = require('../models/Address');

class AddressController {
    static async create(req, res) {
        try {
            const { user_id, street, city, district, province, zip_code } = req.body;

            if (!user_id || !street || !city || !district || !province || !zip_code) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const newAddress = await AddressModel.create({
                user_id,
                street,
                city,
                district,
                province,
                zip_code
            });

            res.status(201).json(newAddress);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Get all addresses by user ID
    static async getByUserId(req, res) {
        try {
            const userId = req.params.userId;
            const addresses = await AddressModel.getByUserId(userId);
    
            // ✅ Return 200 with empty array instead of 404
            return res.status(200).json(addresses);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Update an address by ID
    static async updateById(req, res) {
        try {
            const { id } = req.params;
            const updatedFields = req.body;

            const updatedAddress = await AddressModel.updateById(id, updatedFields);

            if (!updatedAddress) {
                return res.status(404).json({ message: 'Address not found' });
            }

            res.status(200).json(updatedAddress);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Delete an address by ID
    static async deleteById(req, res) {
        try {
            const { id } = req.params;
            const success = await AddressModel.deleteById(id);

            if (!success) {
                return res.status(404).json({ message: 'Address not found' });
            }

            res.status(200).json({ message: 'Address deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = AddressController;

const AddressModel = require('../models/Address');

class AddressController {
  // Create address (from request body, expects user_id in body)
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
        zip_code,
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
      return res.status(200).json(addresses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Create address for a user via URL param
  static async createForUser(req, res) {
    const { userId } = req.params;
    const {
      street,
      city,
      district,
      province,
      zip_code
    } = req.body;

    try {
      if (!street || !city || !district || !province || !zip_code) {
        return res.status(400).json({ message: 'Missing required address fields' });
      }

      const newAddress = await AddressModel.create({
        user_id: userId,
        street,
        city,
        district,
        province,
        zip_code,
      });

      res.status(201).json({ message: 'Address added successfully', address: newAddress });
    } catch (error) {
      console.error("Error creating address:", error);
      res.status(500).json({ message: 'Failed to create address, please try again later' });
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

   static async updateForUser(req, res) {
    try {
      const { userId } = req.params;
      const { street, city, district, province, zip_code } = req.body;

      if (!street || !city || !district || !province || !zip_code) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Get existing addresses
      const existing = await AddressModel.getByUserId(userId);

      if (existing.length > 0) {
        // Update the first one (assuming one address per user)
        const updated = await AddressModel.updateById(existing[0].id, {
          street, city, district, province, zip_code
        });
        return res.status(200).json({ message: 'Address updated', address: updated });
      } else {
        // Create a new one if none exists
        const created = await AddressModel.create({
          user_id: userId,
          street,
          city,
          district,
          province,
          zip_code
        });
        return res.status(201).json({ message: 'Address created', address: created });
      }
    } catch (error) {
      console.error('Update address failed:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }


  
}

module.exports = AddressController;

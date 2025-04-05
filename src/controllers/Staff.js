// const db = require('../config/database');

// // Create a new staff member with image
// exports.createStaff = async (req, res) => {
//   const { name, role, email, phone, image, isAdmin } = req.body;
//   try {
//     const [result] = await db.execute(
//       `INSERT INTO staff (name, role, email, phone, image, isAdmin) VALUES (?, ?, ?, ?, ?, ?)`,
//       [name, role, email, phone, image || null, isAdmin || false]
//     );
//     res.status(201).json({ message: 'Staff member created', staffId: result.insertId });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to create staff member' });
//   }
// };

// // Get staff details by ID
// exports.getStaffById = async (req, res) => {
//   const staffId = req.params.id;
//   try {
//     const [rows] = await db.execute(`SELECT * FROM staff WHERE id = ?`, [staffId]);
//     if (rows.length === 0) {
//       return res.status(404).json({ message: 'Staff member not found' });
//     }
//     res.json(rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to retrieve staff member' });
//   }
// };

// // Update a staff member including image
// exports.updateStaff = async (req, res) => {
//   const staffId = req.params.id;
//   const { name, role, email, phone, image, isAdmin } = req.body;
//   try {
//     await db.execute(
//       `UPDATE staff SET name = ?, role = ?, email = ?, phone = ?, image = ?, isAdmin = ? WHERE id = ?`,
//       [name, role, email, phone, image || null, isAdmin, staffId]
//     );
//     res.json({ message: 'Staff member updated' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to update staff member' });
//   }
// };

// // Delete a staff member
// exports.deleteStaff = async (req, res) => {
//   const staffId = req.params.id;
//   try {
//     await db.execute(`DELETE FROM staff WHERE id = ?`, [staffId]);
//     res.json({ message: 'Staff member deleted' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to delete staff member' });
//   }
// };

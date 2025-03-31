const db = require('../config/database');

// Create an OTP
exports.createOTP = async (req, res) => {
  const { user_id, otp_code, expires_at } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO otp (user_id, otp_code, expires_at) VALUES (?, ?, ?)',
      [user_id, otp_code, expires_at]
    );
    res.status(201).json({ message: 'OTP created', otpId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create OTP' });
  }
};

// Verify an OTP
exports.verifyOTP = async (req, res) => {
  const { user_id, otp_code } = req.body;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM otp WHERE user_id = ? AND otp_code = ? AND expires_at > NOW()',
      [user_id, otp_code]
    );
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    res.json({ message: 'OTP verified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

// Delete an OTP record
exports.deleteOTP = async (req, res) => {
  const otpId = req.params.id;
  try {
    await db.execute('DELETE FROM otp WHERE id = ?', [otpId]);
    res.json({ message: 'OTP deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete OTP' });
  }
};

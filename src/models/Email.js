// models/emailModel.js
const { pool } = require("../config/database");

async function getBillingAddress(addressId) {
  const [rows] = await pool.query("SELECT * FROM addresses WHERE id = ?", [addressId]);
  return rows[0];
}

module.exports = {
  getBillingAddress,
};

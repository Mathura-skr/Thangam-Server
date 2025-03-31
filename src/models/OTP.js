const db = require('../config/database');

const OTP = {
    createTable: async () => {
        const sql = `
            CREATE TABLE IF NOT EXISTS otp (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                otp_code VARCHAR(6) NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        await db.execute(sql);
    }
};

module.exports =  OTP;
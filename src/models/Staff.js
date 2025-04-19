// const db = require('../config/database');

// const Staff = {
//     createTable: async () => {
//         const sql = `
//             CREATE TABLE IF NOT EXISTS staff (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 name VARCHAR(255) NOT NULL,
//                 role VARCHAR(255) NOT NULL,
//                 email VARCHAR(255) UNIQUE NOT NULL,
//                 phone VARCHAR(15),
//                 image_url VARCHAR(500),  
//                 isAdmin BOOLEAN DEFAULT FALSE
//             )
//         `;
//         await db.execute(sql);
//     }
// };

// module.exports =  Staff;
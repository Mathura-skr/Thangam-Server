const mysql = require('mysql2/promise');  
const dotenv = require('dotenv');
const { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } = require('./config.js');


  dotenv.config();

const pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

//Test the connection immediately when the app starts.
pool.getConnection()
    .then(() => {
        console.log('✅ MySQL Connected Successfully!');
    })
    .catch(err => {
        console.error('❌ MySQL Connection Error: ', err);
    });
module.exports = {pool};

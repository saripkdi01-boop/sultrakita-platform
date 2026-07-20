const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.pusatpropertyid.com,
  user: process.env.pusatpr8_sultrakita,
  password: process.env.Aklaman987@_,
  database: process.env.pusatpr8_sultrakita,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();

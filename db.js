const mysql = require('mysql2/promise');

const config = require('./config');

const pool = mysql.createPool(config.database);

module.exports.query = async (query, bindings) => {
  const [result] = await pool.query(query, bindings);
  return result;
};

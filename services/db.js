const mysql = require('mysql2/promise');

var config = {
    user: process.env.SQL_USER,
    database: process.env.SQL_DATABASE,
    password: process.env.SQL_PASSWORD
}

async function query(sql, params) {
  if (process.env.INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === 'production') {
    config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
  }
  const connection = await mysql.createConnection(config);
  const [results, ] = await connection.execute(sql, params);

  return results;
}

module.exports = {
  query
}
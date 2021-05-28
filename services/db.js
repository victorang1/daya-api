const mysql = require('mysql2/promise');

const winston = require('winston');
const { LoggingWinston } = require('@google-cloud/logging-winston');
const loggingWinston = new LoggingWinston();
const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console(), loggingWinston],
});

const createTcpPool = async config => {
  const dbSocketAddr = process.env.DB_HOST.split(':');

  return await mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: dbSocketAddr[0],
    port: dbSocketAddr[1],
    ...config,
  });
};

const createUnixSocketPool = async config => {
  const dbSocketPath = process.env.DB_SOCKET_PATH || '/cloudsql';

  return await mysql.createPool({
    user: process.env.DB_USER, 
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    socketPath: `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
    ...config,
  });
};

const createPool = async () => {
  const config = {
    connectionLimit: 5,
    connectTimeout: 10000,
    acquireTimeout: 10000,
    waitForConnections: true,
    queueLimit: 0,
  };
  if (process.env.DB_HOST) {
    return await createTcpPool(config);
  } else {
    return await createUnixSocketPool(config);
  }
};

const createPoolAndEnsureSchema = async () =>
  await createPool()
    .then(async pool => {
      return pool;
    })
    .catch(err => {
      logger.error(err);
      throw err;
    });

let pool;

async function query(sql, params) {
  pool = pool || (await createPoolAndEnsureSchema());
  const results = await pool.query(sql, params);

  return results;
}

module.exports = {
  query
}
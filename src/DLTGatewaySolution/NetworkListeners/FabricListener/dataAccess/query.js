/*
 * FabricListener\dataAccess\query.js
 */

// https://github.com/tediousjs/node-mssql
const mssql = require('mssql');

mssql.on('error', (err) => {
  console.error(`SQL error: ${err}`);
});

const loadResult = require('dotenv').config();

if (loadResult.error) {
  throw loadResult.error;
}

const dbConfig = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  server: process.env.SERVER,
  database: process.env.DATABASE,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};
console.debug(`Database config: ${dbConfig.server}/${dbConfig.database}/${dbConfig.user}`);

// The app should use only this pool, not the global one.
const connectionPool = new mssql.ConnectionPool(dbConfig);
connectionPool.on('error', console.error);
let connected = false;
const connect = () => {
  if (!connected) {
    connected = true;
    return connectionPool.connect().then(() => Promise.resolve('SQL connection created.'));
  }

  return Promise.resolve(connectionPool);
};

const disconnect = () => {
  if (connected) {
    connected = false;
    console.debug('SQL connection closed.');
    return connectionPool.close();
  }
  return Promise.resolve('SQL connection previously closed.');
};
const query = (...sqlQueries) => {
  if (sqlQueries.length === 1) {
    const sql = sqlQueries[0];
    return connect().then(pool => pool.request().query(sql));
  }

  return connect().then(pool => Promise.all(
    sqlQueries.map(sql => pool.request().query(sql)),
  ));
};

exports.connect = connect;
exports.disconnect = disconnect;
exports.connectionPool = connectionPool;
exports.query = query;

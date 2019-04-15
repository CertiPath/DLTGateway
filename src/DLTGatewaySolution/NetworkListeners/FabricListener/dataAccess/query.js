/*
 * FabricListener\dataAccess\query.js
 */

// https://github.com/tediousjs/node-mssql
const mssql = require('mssql');
const config = require('./config');

mssql.on('error', (err) => {
  console.error(`SQL error: ${err}`);
});

let connectionPool = null;
const createAppConnectionPool = (dbConfig) => {
  // The app should use only this pool, not the global one.
  connectionPool = new mssql.ConnectionPool(dbConfig);
  connectionPool.on('error', console.error);
};

let dbConfig = null;
let connected = false;
const connect = () => {
  if (!dbConfig) {
    dbConfig = config.load();
    createAppConnectionPool(dbConfig);
  }
  if (!connected) {
    connected = true;
      return connectionPool.connect().then(pool => {
          console.debug('SQL connection created.');
          return Promise.resolve(pool);
      });
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

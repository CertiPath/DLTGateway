/*
 * src\DLTGatewaySolution\NetworkListeners\FabricListener\dataAccess\query.js
 */
'use strict';

//https://github.com/tediousjs/node-mssql
const sql = require('mssql');

sql.on('error', err => {
    console.error(`SQL error: ${err}`);
})

require('dotenv').config();
const dbConfig = {
    user: process.env.USER,
    password: process.env.PASSWORD,
    server: process.env.SERVER,
    database: process.env.DATABASE,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
}
console.debug(`Database config: ${dbConfig.server}/${dbConfig.database}/${dbConfig.user}`);

// The app should use only this pool, not the global one.
const connectionPool = new sql.ConnectionPool(dbConfig);
connectionPool.on('error', console.error);
let connected = false;
const connect = () => {
    if (!connected) {
        connected = true;
        console.debug('SQL connection created.');
        return connectionPool.connect();
    }

    return Promise.resolve(connectionPool);
};

const disconnect = () => {
    if (connected) {
        connected = false;
        console.debug('SQL connection closed.');
        return connectionPool.close();
    }
    console.debug('SQL connection previously closed.');
};
const query = (...sqlQueries) => {
    if (sqlQueries.length === 1) {
        const sql = sqlQueries[0];
        return connect().then(pool => pool.request().query(sql));
    }

    return connect().then(pool => Promise.all(
        sqlQueries.map(sql => pool.request().query(sql)))
    );
};

exports.connect = connect;
exports.disconnect = disconnect;
exports.connectionPool = connectionPool;
exports.query = query;

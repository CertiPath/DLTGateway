/**
 * FabricListener\dataAccess\config.js
 */
const DotEnv = require('dotenv');

const pack = (dotEnvLoadResult) => {
  if (dotEnvLoadResult && dotEnvLoadResult.error) {
    throw dotEnvLoadResult.error;
  }

  const {
    SQL_LOGIN_ID: user,
    SQL_LOGIN_PWD: password,
    SQL_SERVER_NAME_OR_IP: server,
    SQL_DB_NAME: database,
  } = process.env;

  if (!user) {
    throw Error('SQL Login ID not found');
  }

  if (!password) {
    throw Error('SQL Login password not found');
  }

  if (!server) {
    throw Error('SQL server name or IP address not found');
  }

  if (!database) {
    throw Error('SQL database name not found');
  }

  console.debug(`Database config: ${server}/${database}/${user}`);
  return {
    user,
    password,
    server,
    database,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  };
};

const load = () => {
  let dbConfig = null;

  try {
    console.debug('Loading database config from environment variables...');
    dbConfig = pack();
    console.debug('Database config loaded from environment variables.');
  } catch (_) {
    console.debug('Loading database config from .env file...');
    dbConfig = pack(DotEnv.config());
    console.debug('Database config loaded from .env file.');
  }

  return dbConfig;
};

exports.load = load;

/**
 * FabricListener\dataAccess\config.js
 */
const fs = require('fs');
const DotEnv = require('dotenv');

const readProcessEnv = (dotEnvLoadResult) => {
  if (dotEnvLoadResult && dotEnvLoadResult.error) {
    throw dotEnvLoadResult.error;
  }

  const {
    SQL_SERVER_NAME_OR_IP: server,
    SQL_DB_NAME: database,
    SQL_LOGIN_ID: user,
    SQL_LOGIN_PWD: password,
  } = process.env;

  if (!server) {
    throw Error('SQL server name or IP address not found');
  }

  if (!database) {
    throw Error('SQL database name not found');
  }

  if (!user) {
    throw Error('SQL Login ID not found');
  }

  console.debug(`Database config: ${server}/${database}/${user}`);
  return {
    server,
    database,
    user,
    password,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  };
};

const readDockerSecret = (key) => {
  return fs.readFileSync(`/run/secrets/${key}`, 'utf8');
};

const load = () => {
  let dbConfig = null;

  try {
    dbConfig = readProcessEnv();
  } catch (readingError) {
    console.debug(`Cannot read database config from environment variables. ${readingError}`);
  }

  if (!dbConfig) {
    // This application can run without using Docker container.
    // In that case, a `.env` file can be used to load database config.
    try {
      dbConfig = readProcessEnv(DotEnv.config());
    } catch (readingProcessEnvError) {
      console.debug(`Cannot read database config from .env file. ${readingProcessEnvError}`);
    }
  }

  let { password } = dbConfig;
  // The password could be loaded from a .env file.
  // However, when running Docker container, there is no .env file available.
  // In the case of Docker, the password could be passed in as a secret.
  if (!password) {
    try {
      password = readDockerSecret('SQL_LOGIN_PWD');
    } catch (readingDockerSecretError) {
      console.debug(`Cannot read SQL login password from Docker secrets. ${readingDockerSecretError}`);
    }
  }

  return { password, ...dbConfig };
};

exports.load = load;

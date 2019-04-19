/**
 * FabricListener\dataAccess\config.js
 */
const fs = require('fs');
const crypto = require('crypto');
const DotEnv = require('dotenv');

const parse = cns => cns.split(';').map((pair) => {
  const [key, value] = pair.split('=');
  return {
    key: key.toLowerCase(),
    value,
  };
}).reduce((previous, current) => ({ [current.key]: current.value, ...previous }), {});

const readProcessEnv = (dotEnvLoadResult) => {
  if (dotEnvLoadResult && dotEnvLoadResult.error) {
    throw dotEnvLoadResult.error;
  }

  const {
    DLT_SQL_CNS: connectionString,
  } = process.env;

  const {
    server,
    database,
    'user id': user,
    password,
  } = parse(connectionString);

  console.debug(`Successfully read database config: ${server}/${database}/${user}`);
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
  console.debug('Reading Docker secrets');
  return fs.readFileSync(`/run/secrets/${key}`, 'utf8');
};

const load = () => {
  let dbConfig = null;

  try {
    dbConfig = readProcessEnv();
  } catch (readingError) {
    console.debug(`Failed read database config from environment variables. ${readingError}`);
  }

  if (!dbConfig) {
    // This application can run without using Docker container.
    // In that case, a `.env` file can be used to load database config.
    try {
      dbConfig = readProcessEnv(DotEnv.config());
    } catch (readingProcessEnvError) {
      console.debug(`Failed to read database config from .env file. ${readingProcessEnvError}`);
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
      console.debug(`Failed to read SQL login password from Docker secrets. ${readingDockerSecretError}`);
    }
  }

  if (!password) {
    throw new Error('Failed to load SQL login password.');
  }

  dbConfig.password = password;

  const hash = crypto.createHash('md5').update(password).digest('hex');
  console.debug(`Hashed password: ${hash}`);

  return dbConfig;
};

exports.parse = parse;
exports.load = load;

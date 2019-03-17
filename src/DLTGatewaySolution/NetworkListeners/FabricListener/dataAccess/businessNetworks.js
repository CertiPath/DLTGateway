/*
 * FabricListener\dataAccess\businessNetworks.js
 */

const promiseRetry = require('promise-retry');
const db = require('./query');
const records = require('./records');

const search = ({ frameworkName, networkName }, options) => {
  if (!frameworkName) {
    throw Error('Argument excception: frameworkName is required but missing.');
  }
  const { query = db.query, logger = console } = options || {};
  const andNetworkNameCondition = networkName ? `AND N.Name ='${networkName}'` : '';
  const sql = `
SELECT N.GUID,
       N.Name,
       N.LastBlockProcessed
FROM   BusinessNetwork AS N 
       INNER JOIN BlockchainFramework AS F 
               ON N.BlockchainFrameworkGUID = F.GUID 
WHERE  N.Deleted = 0 
AND F.Deleted = 0
AND F.Name = '${frameworkName}'
       ${andNetworkNameCondition}
`;

  return promiseRetry({
    retries: 1,
  }, (retry, number) => {
    logger.log('attempt number', number);

    return query(sql).catch(retry);
  }).then((result) => {
    const networks = records.fromRecordset(result.recordset);
    if (networks.length) {
      return Promise.resolve(networks);
    }

    logger.error('Business Networks not found.');
    return Promise.reject(new Error('Business Networks not found.'));
  });
};

exports.search = search;

/*
 * FabricListener\dataAccess\businessNetworks.js
 */

const db = require('./query');
const records = require('./records');

const search = ({ frameworkName, networkName }, options) => {
  if (!frameworkName) {
    return Promise.reject(new Error('Argument exception: frameworkName is required but missing.'));
  }
  const {
    query = db.query,
    convertToObject = records.fromRecordset,
    logger = console,
  } = options || {};
  const andNetworkNameCondition = networkName ? `AND N.Name ='${networkName}'` : '';
  const sql = `
SELECT N.*
FROM   BusinessNetwork AS N 
       INNER JOIN BlockchainFramework AS F 
               ON N.BlockchainFrameworkGUID = F.GUID 
WHERE  N.Deleted = 0 
AND F.Deleted = 0
AND F.Name = '${frameworkName}'
       ${andNetworkNameCondition}
`;

  return query(sql)
    .then((result) => {
      const networks = convertToObject(result.recordset);
      if (networks.length) {
        return Promise.resolve(networks);
      }

      logger.error('Business Networks not found.');
      return Promise.reject(new Error('Business Networks not found.'));
    });
};

exports.search = search;

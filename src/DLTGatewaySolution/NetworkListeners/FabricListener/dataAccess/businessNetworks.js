/*
 * src\DLTGatewaySolution\NetworkListeners\FabricListener\dataAccess\businessNetworks.js
 */
'use strict';

const db = require('./query');
const records = require('./records');

const search = ({ frameworkName, networkName }) => {
    const andNetworkNameCondition = networkName ? `AND N.Name ='${networkName}'` : '';
    const sql = `
SELECT * 
FROM   BusinessNetwork AS N 
       INNER JOIN BlockchainFramework AS F 
               ON N.BlockchainFrameworkGUID = F.GUID 
WHERE  N.Deleted = 0 
       AND F.Deleted = 0
       AND F.Name = '${frameworkName}'
       ${andNetworkNameCondition}
`;
    return db.query(sql).then(result => {
        const networks = records.fromRecordset(result.recordset);
        if (networks.length) {
            return Promise.resolve(networks);
        }

        console.error(`Business Networks not found. SQL: "${sql}"`);
        return Promise.reject(`Business Networks not found.`);
    });
};

exports.search = search;

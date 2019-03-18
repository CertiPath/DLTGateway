/*
 * FabricListener\dataAccess\transactionHistory.js
 */

const Mssql = require('mssql');
const { t } = require('typy');
const flat = require('array.prototype.flat');
const db = require('./query');
const records = require('./records');


const add = ({
  networkName,
  networkGUID,
  blockNumber,
  transactions,
  entirePayload,
}, options) => {
  const {
    dbConnect = db.connect,
    poolRequest = pool => pool.request(),
    countAffectedRecords = records.countAffected,
    logger = console,
  } = options || {};

  return dbConnect()
    .then(pool => Promise.all(
      transactions.map(({ payload: tranPayload }, tranIndex) => {
        const { tx_id: tranID, channel_id: channelName } = t(tranPayload, 'header.channel_header');
        const mspid = t(tranPayload, 'header.signature_header.creator.Mspid');
        const { actions } = tranPayload.data;

        return Promise.all(actions.map(({ payload: actionPayload }, actionIndex) => {
          const chaincodeName = t(
            actionPayload,
            'chaincode_proposal_payload.input.chaincode_spec.chaincode_id.name',
          );
          const { version } = t(
            actionPayload,
            'action.proposal_response_payload.extension.chaincode_id',
          );

          return poolRequest(pool)
            .input('networkGUID', Mssql.UniqueIdentifier, networkGUID)
            .input('blockNumber', Mssql.Int, blockNumber)
            .input('transactionID', Mssql.NVarChar(100), tranID)
            .input('data', Mssql.NVarChar(Mssql.MAX), entirePayload)
            .input('channelName', Mssql.NVarChar(100), channelName)
            .input('chaincodeName', Mssql.NVarChar(100), chaincodeName)
            .input('mspid', Mssql.NVarChar(100), mspid)
            .input('version', Mssql.NVarChar(100), version)
            .execute('AddTransaction')
            .then((result) => {
              logger.info(`[${networkName}] Saved block ${blockNumber}, transaction ${tranIndex + 1}/${transactions.length}, action ${actionIndex + 1}/${actions.length}`);
              return Promise.resolve(countAffectedRecords(result));
            });
        }));
      }),
    ))
    .then(affectedRecordCounts => Promise.resolve(
      flat(affectedRecordCounts)
        .reduce((prev, curr) => prev + curr, 0),
    ));
};

exports.add = add;

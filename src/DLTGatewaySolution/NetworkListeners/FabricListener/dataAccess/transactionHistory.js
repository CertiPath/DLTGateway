/*
 * NodeBackgroundService\dataAccess\transactionHistory.js
 */
'use strict';

const sql = require('mssql');
const db = require('./query');
const records = require('./records');
const log = require('../eventLog');

const add = ({
    networkName,
    networkGUID,
    blockNumber,
    transactions,
    entirePayload,
}) => {
    return db.connect().
        then(pool => {
            return Promise.all(
                transactions.map((tran, tranIndex) => {

                    const tranID = tran.payload.header.channel_header.tx_id;
                    const channelName = tran.payload.header.channel_header.channel_id;
                    const mspid = tran.payload.header.signature_header.creator.Mspid;

                    const actions = tran.payload.data.actions;
                    return Promise.all(actions.map((action, actionIndex) => {
                        const chaincodeName = action.payload.chaincode_proposal_payload.input.chaincode_spec.chaincode_id.name;
                        const version = action.payload.action.proposal_response_payload.extension.chaincode_id.version;

                        return pool.request()
                            .input('networkGUID', sql.UniqueIdentifier, networkGUID)
                            .input('blockNumber', sql.Int, blockNumber)
                            .input('transactionID', sql.NVarChar(100), tranID)
                            .input('data', sql.NVarChar(sql.MAX), entirePayload)
                            .input('channelName', sql.NVarChar(100), channelName)
                            .input('chaincodeName', sql.NVarChar(100), chaincodeName)
                            .input('mspid', sql.NVarChar(100), mspid)
                            .input('version', sql.NVarChar(100), version)
                            .execute('AddTransaction')
                            .then(result => {
                                log.info(`[${networkName}] Saved block ${blockNumber}, transaction [${tranIndex + 1}/${transactions.length}]: ${tranID.substring(0, 5)}..., action [${actionIndex + 1}/${actions.length}]: ${chaincodeName} v. ${version}.`);
                                return Promise.resolve(records.countAffected(result));
                            });
                    }));
                }));
        });
};

exports.add = add;
/*
 * src\DLTGatewaySolution\NetworkListeners\FabricListener\fabric\index.js
 */
'use strict';

const db = require('../dataAccess');
const log = require('../eventLog');
const eventHub = require('./eventHub');

const connect = (targetNetworkName) => db.businessNetworks.search({ frameworkName: 'HLF', networkName: targetNetworkName })
  .then(businessNetworks => {
    log.info(`Found ${businessNetworks.length} HLF networks from database.`);
    return Promise.all(businessNetworks.map(businessNetwork => eventHub.createEventHub(businessNetwork)));
  })
  .then(eventHubs => {
    eventHubs.forEach(({ eventHub, networkGUID, networkName, startBlock }) => {
      let lastStartBlock = -1;
      const step = (startBlock, count = 10) => {
        if (lastStartBlock === startBlock) {
          log.info(`[${networkName}] Start block number is the same as previous step.`);
          return Promise.resolve({ shouldContinue: false });
        }
        log.info(`[${networkName}] Start block number is ${startBlock}.`);
        lastStartBlock = startBlock;
        const listen = new Promise((resolve) => {
          let blocks = [];
          let timer;
          const listenerId = eventHub.registerBlockEvent(eventHub, block => {

            log.info(`[${networkName}] Block ${block.header.number} received.`);
            blocks.push(block);

            const stop = () => {
              eventHub.unregisterBlockEvent(eventHub, listenerId, networkName);
              resolve(blocks);
            };

            if (timer) {
              clearTimeout(timer);
              timer = null;
            }

            if (blocks.length < count) {
              timer = setTimeout(() => {
                log.warn(`[${networkName}] Timed out for block event.`);
                stop();
              }, 6 * 1000);
              return;
            }
            stop();
          }, networkName, startBlock);
        });

        return listen.then(blocks => {
          const numbers = blocks.map(block => Number.parseInt(block.header.number));
          const maxBlockNumber = Math.max(...numbers);
          Promise.all(blocks.map(block => {
            const blockNumber = block.header.number;
            const transactions = block.data.data;
            return db.transactionHistory
              .add({
                networkName: networkName,
                networkGUID: networkGUID,
                blockNumber: blockNumber,
                transactions: transactions,
                entirePayload: JSON.stringify(block),
              });
          })).then(() => {
            log.info(`[${networkName}] Saved ${blocks.length} blocks to database.`);
            step(maxBlockNumber, count);
          });
        });

      };
      step(startBlock);
    });
  });



exports.createEventHub = eventHub.create;
exports.registerBlockEvent = eventHub.registerBlockEvent;
exports.unregisterBlockEvent = eventHub.unregisterBlockEvent;
exports.connect = connect;

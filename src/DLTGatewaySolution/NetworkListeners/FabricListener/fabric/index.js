/*
 * FabricListener\fabric\index.js
 */

const db = require('../dataAccess');
const hub = require('./eventHub');

const frameworkName = 'HLF';

const connect = (targetNetworkName, options) => {
  const {
    search = db.businessNetworks.search,
    log = console,
    createEventHub = hub.create,
    unregisterBlockEvent = hub.unregisterBlockEvent,
    registerBlockEvent = hub.registerBlockEvent,
    addTransactionHistory = db.transactionHistory.add,
  } = options || {};
  search({ frameworkName, networkName: targetNetworkName })
    .then((businessNetworks) => {
      log.info(`Found ${businessNetworks.length} business networks from database.`);
      return Promise.all(businessNetworks.map(businessNetwork => createEventHub(businessNetwork)));
    })
    .then((eventHubs) => {
      eventHubs.forEach(({
        eventHub, networkGUID, networkName, startBlock,
      }) => {
        let lastStartBlock = -1;
        const step = (stepStart, count = 10) => {
          if (lastStartBlock === stepStart) {
            log.info(`[${networkName}] Start block number is the same as previous step.`);
            return Promise.resolve({ shouldContinue: false });
          }
          log.info(`[${networkName}] Start block number is ${stepStart}.`);
          lastStartBlock = stepStart;
          let listenerId = -1;
          const listen = new Promise((resolve) => {
            const blocks = [];
            let timer;
            const listener = (block) => {
              log.info(`[${networkName}] Block ${block.header.number} received.`);
              blocks.push(block);

              const stop = () => {
                unregisterBlockEvent({ eventHub, listenerId, networkName });
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
            };
            listenerId = registerBlockEvent({
              eventHub,
              listener,
              networkName,
              startBlock: stepStart,
            });
          });

          return listen.then((blocks) => {
            const numbers = blocks.map(block => Number.parseInt(block.header.number, 10));
            const maxBlockNumber = Math.max(...numbers);
            Promise.all(blocks.map((block) => {
              const blockNumber = block.header.number;
              const transactions = block.data.data;
              return addTransactionHistory({
                networkName,
                networkGUID,
                blockNumber,
                transactions,
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
};


exports.createEventHub = hub.create;
exports.registerBlockEvent = hub.registerBlockEvent;
exports.unregisterBlockEvent = hub.unregisterBlockEvent;
exports.connect = connect;

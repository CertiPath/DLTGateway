/*
 * FabricListener\fabric\index.js
 */

const db = require('../dataAccess');
const hub = require('./eventHub');

const connect = targetNetworkName => db.businessNetworks.search({ frameworkName: 'HLF', networkName: targetNetworkName })
  .then((businessNetworks) => {
    console.info(`Found ${businessNetworks.length} HLF networks from database.`);
    return Promise.all(businessNetworks.map(businessNetwork => hub.create(businessNetwork)));
  })
  .then((eventHubs) => {
    eventHubs.forEach(({
      eventHub, networkGUID, networkName, startBlock,
    }) => {
      let lastStartBlock = -1;
      const step = (stepStart, count = 10) => {
        if (lastStartBlock === stepStart) {
          console.info(`[${networkName}] Start block number is the same as previous step.`);
          return Promise.resolve({ shouldContinue: false });
        }
        console.info(`[${networkName}] Start block number is ${stepStart}.`);
        lastStartBlock = stepStart;
        let listenerId = -1;
        const listen = new Promise((resolve) => {
          const blocks = [];
          let timer;
          const listener = (block) => {
            console.info(`[${networkName}] Block ${block.header.number} received.`);
            blocks.push(block);

            const stop = () => {
              hub.unregisterBlockEvent({ eventHub, listenerId, networkName });
              resolve(blocks);
            };

            if (timer) {
              clearTimeout(timer);
              timer = null;
            }

            if (blocks.length < count) {
              timer = setTimeout(() => {
                console.warn(`[${networkName}] Timed out for block event.`);
                stop();
              }, 6 * 1000);
              return;
            }
            stop();
          };
          listenerId = hub.registerBlockEvent({
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
            return db.transactionHistory
              .add({
                networkName,
                networkGUID,
                blockNumber,
                transactions,
                entirePayload: JSON.stringify(block),
              });
          })).then(() => {
            console.info(`[${networkName}] Saved ${blocks.length} blocks to database.`);
            step(maxBlockNumber, count);
          });
        });
      };
      step(startBlock);
    });
  });


exports.createEventHub = hub.create;
exports.registerBlockEvent = hub.registerBlockEvent;
exports.unregisterBlockEvent = hub.unregisterBlockEvent;
exports.connect = connect;

﻿/*
 * FabricListener\fabric\eventHub.js
 */

const path = require('path');
const FabricClient = require('fabric-client');

const createEventHub = ({
  GUID: networkGUID,
  Name: networkName,
  ChannelName: channelName,
  PeerAddress: peerAddress,
  Username: username,
  CryptoMaterialDirectory: cryptoMaterialDirectory,
  LastBlockProcessed: lastBlockProcessed,
}, options) => {
  const {
    createFabricClient = () => new FabricClient(),
    log = console,
  } = options || {};

  const info = msg => log.info(`[${networkName}] ${msg}`);

  info(`Created Fabric client with channel "${channelName}" and peer "${peerAddress}".`);
  // Setup the fabric network
  const client = createFabricClient();
  const channel = client.newChannel(channelName);
  const peer = client.newPeer(peerAddress);
  channel.addPeer(peer);
  const eventHub = channel.newChannelEventHub(peer);

  const storePath = path.join(__dirname, '..', cryptoMaterialDirectory);
  info(`Calculated path for crypto material to be "${storePath}".`);
  return FabricClient.newDefaultKeyValueStore({ path: storePath })
    .then((stateStore) => {
      // Assign the store to the fabric client.
      client.setStateStore(stateStore);
      const cryptoSuite = FabricClient.newCryptoSuite();
      // Use the same location for the state store (where the user certificates are kept)
      // and the crypto store (where the user keys are kept).
      const keyStore = FabricClient.newCryptoKeyStore({ path: storePath });
      cryptoSuite.setCryptoKeyStore(keyStore);
      client.setCryptoSuite(cryptoSuite);

      return client.getUserContext(username, true);
    })
    .then((user) => {
      // Get the enrolled user from persistence, this user will sign all requests.
      // https://fabric-sdk-node.github.io/Client.html#getUserContext__anchor
      info(`Loading the user by name "${username}" from the local storage`);
      let isEnrolled = false;
      if (!user) {
        return Promise.reject(
          new Error('User not found.')
        );
      }

      info(`Verifying enrollment for user "${username}"`);
      isEnrolled = user.isEnrolled();

      if (isEnrolled) {
        info('Successfully verified user enrollment');
        return Promise.resolve({
          eventHub, networkGUID, networkName, startBlock: lastBlockProcessed,
        });
      }

      return Promise.reject(
        new Error('Failed to verify user enrollment.')
      );
    });
};

const registerBlockEvent = ({
  eventHub,
  listener,
  networkName,
  startBlock,
}, options) => {
  const {
    log = console,
  } = options || {};

  const listenerId = eventHub.registerBlockEvent(
    listener,
    (err) => {
      log.warn(`[${networkName}] ${err}`);
    },
    { startBlock },
  );
  log.info(`[${networkName}] Registered block event listener.`);

  eventHub.connect({ full_block: true });
  log.info(`[${networkName}] Start listening to block events.`);
  return listenerId;
};

const unregisterBlockEvent = ({ eventHub, listenerId, networkName }, options) => {
  const {
    log = console,
  } = options || {};

  log.info(`[${networkName}] Unregister block event listener.`);
  eventHub.unregisterBlockEvent(listenerId);
  eventHub.disconnect();
  log.info(`[${networkName}] Stopped listening to block events.`);
};


exports.create = createEventHub;
exports.registerBlockEvent = registerBlockEvent;
exports.unregisterBlockEvent = unregisterBlockEvent;

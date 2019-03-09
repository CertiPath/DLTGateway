/*
 * DLTGateway\src\DLTGatewaySolution\NetworkListeners\FabricListener\fabric\eventHub.js
 */
'use strict';

const path = require('path');
const FabricClient = require('fabric-client');

const createEventHub = ({
  GUID: networkGUID,
  Name: networkName,
  ChannelName: channelName,
  PeerAddress: peerAddress,
  Username: username,
  CryptoMaterialDirectory: cryptoMaterialDirectory,
  LastBlockProcessed: lastBlockProcessed
}, options = {}) => {

  const {
    createFabricClient = () => new FabricClient(),
    console = console
  } = options;

  // Setup the fabric network
  const client = createFabricClient();
  const channel = client.newChannel(channelName);
  const peer = client.newPeer(peerAddress);
  channel.addPeer(peer);
  const eventHub = channel.newChannelEventHub(peer);
  console.info(`[${networkName}] Created Fabric client with channel "${channelName}" and peer "${peerAddress}".`);

  const storePath = path.join(__dirname, '..', cryptoMaterialDirectory);
  return FabricClient.newDefaultKeyValueStore({ path: storePath })
    .then(stateStore => {
      // Assign the store to the fabric client.
      client.setStateStore(stateStore);
      const cryptoSuite = FabricClient.newCryptoSuite();
      // Use the same location for the state store (where the user certificates are kept)
      // and the crypto store (where the user keys are kept).
      const keyStore = FabricClient.newCryptoKeyStore({ path: storePath });
      cryptoSuite.setCryptoKeyStore(keyStore);
      client.setCryptoSuite(cryptoSuite);

      // Get the enrolled user from persistence, this user will sign all requests.
      console.info(`[${networkName}] Loading user context for '${username}'`);

      return client.getUserContext(username, true);
    })
    .then(user => {
      if (user && user.isEnrolled()) {
        console.info(`[${networkName}] Verified enrollment for user "${username}".`);

        return Promise.resolve({ eventHub, networkGUID, networkName, startBlock: lastBlockProcessed });
      }
      return Promise.reject(`[${networkName}] Failed to verify enrollment for user "${username}".`);
    });
};

const registerBlockEvent = (eventHub, listener, networkName, startBlock) => {
  const listenerId = eventHub.registerBlockEvent(
    listener,
    err => {
      console.warn(`[${networkName}] ${err}`);
    },
    { startBlock }
  );
  console.info(`[${networkName}] Registered block event listener.`);

  eventHub.connect({ full_block: true });
  console.info(`[${networkName}] Start listening to block events.`);
  return listenerId;
};
const unregisterBlockEvent = (eventHub, listenerId, networkName) => {
  console.info(`[${networkName}] Unregister block event listener.`)
  eventHub.unregisterBlockEvent(listenerId);
  eventHub.disconnect();
  console.info(`[${networkName}] Stopped listening to block events.`);
};


exports.create = createEventHub;
exports.registerBlockEvent = registerBlockEvent;
exports.unregisterBlockEvent = unregisterBlockEvent;

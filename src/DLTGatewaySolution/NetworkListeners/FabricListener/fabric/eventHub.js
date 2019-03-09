'use strict';

const path = require('path');
const FabricClient = require('fabric-client');

const createEventHub = ({
  GUID,
  Name,
  ChannelName,
  PeerAddress,
  Username,
  CryptoMaterialDirectory,
  LastBlockProcessed
}) => {

  if (!businessNetwork) {
    return Promise.reject('Argument exception: businessNetwork.');
  }

  // Setup the fabric network
  const client = new FabricClient();
  const channel = client.newChannel(ChannelName);
  const peer = client.newPeer(PeerAddress);
  channel.addPeer(peer);
  const eventHub = channel.newChannelEventHub(peer);
  console.info(`[${Name}] Created Fabric client with channel "${ChannelName}" and peer "${PeerAddress}".`);

  const storePath = path.join(__dirname, '..', CryptoMaterialDirectory);
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
      console.info(`[${Name}] Loading user context for '${Username}'`);

      return client.getUserContext(Username, true);
    })
    .then(user => {
      if (user && user.isEnrolled()) {
        console.info(`[${Name}] Verified enrollment for user "${Username}".`);

        return Promise.resolve({ eventHub, networkGUID: GUID, networkName: Name, startBlock: LastBlockProcessed });
      }
      return Promise.reject(`[${Name}] Failed to verify enrollment for user "${Username}".`);
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

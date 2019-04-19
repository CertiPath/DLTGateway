/*
 * FabricListener\test\fabricTests.js
 */

const assert = require('assert');
const EventHub = require('../fabric');

const testValues = {
  networkGUID: '35838015-ad4d-4d25-ba4c-dbba6f2a0224',
  networkName: 'network 2434897',
  startBlock: 1873,
  listenerId: 874,
  block1: { 1: 11 },
  block2: { 2: 22 },
};
const createEventHub = (peer, options) => ({ peer, ...options });
const createFabricClient = (options) => {
  const {
    isEnrolled = true,
    getUserContext = () => Promise.resolve(/* user */ {
      isEnrolled: () => isEnrolled,
    }),
    newChannelEventHub = createEventHub,
  } = options || {};
  return {
    newChannel: channelName => ({
      channelName,
      addPeer: (peer) => {
        this.peer = peer;
      },
      newChannelEventHub,
    }),
    newPeer: peerAddress => ({
      peerAddress,
    }),
    newCryptoKeyStore: ({ path }) => ({ path }),
    newCryptoSuite: () => ({
      setCryptoKeyStore: (keyStore) => {
        this.keyStore = keyStore;
      },
    }),
    newDefaultKeyValueStore: () => Promise.resolve(/* stateStore */ {}),

    setStateStore: (stateStore) => {
      this.stateStore = stateStore;
    },
    setCryptoSuite: (cryptoSuite) => {
      this.cryptoSuite = cryptoSuite;
    },
    getUserContext,
  };
};

// Create a fake console object to keep the real console clear.
const createConsole = () => ({
  info: () => { /* Discard the info. */ },
});

describe('eventHub', () => {
  it('should create a new channel event hub', (done) => {
    const fakeEventHub = { someProp: 'some value' };
    const businessNetwork = {
      GUID: '35838015-ad4d-4d25-ba4c-dbba6f2a0224',
      Name: testValues.networkName,
      CryptoMaterialDirectory: 'wallet',
    };
    const options = {
      createFabricClient: createFabricClient.bind(null, {
        newChannelEventHub: () => fakeEventHub,
      }),
      log: createConsole(),
    };
    EventHub.createEventHub(businessNetwork, options).then(({ eventHub }) => {
      assert.deepStrictEqual(eventHub, fakeEventHub);
      done();
    })
      .catch(done);
  });

  it('should catch un-enrolled user', (done) => {
    const businessNetwork = {
      GUID: '35838015-ad4d-4d25-ba4c-dbba6f2a0224',
      Name: testValues.networkName,
      CryptoMaterialDirectory: 'wallet',
      Username: 'user3123',
    };
    const options = {
      createFabricClient: createFabricClient.bind(null, { isEnrolled: false }),
      log: createConsole(),
    };
    EventHub.createEventHub(businessNetwork, options)
      .then(() => Promise.resolve(), err => Promise.resolve(err.message))
      .then((msg) => {
        assert.equal(msg, 'Failed to verify user enrollment.');
        done();
      })
      .catch(done);
  });

  it('should catch missing user context', (done) => {
    const businessNetwork = {
      GUID: '35838015-ad4d-4d25-ba4c-dbba6f2a0224',
      Name: testValues.networkName,
      CryptoMaterialDirectory: 'wallet',
      Username: 'user3123',
    };
    const errorMessage = 'Failed to get user context.';
    const options = {
      createFabricClient: createFabricClient.bind(null, {
        getUserContext: () => Promise.reject(errorMessage),
      }),
      log: createConsole(),
    };
    EventHub.createEventHub(businessNetwork, options)
      .then(() => Promise.resolve(), err => Promise.resolve(err))
      .then((msg) => {
        assert.equal(msg, errorMessage);
        done();
      })
      .catch(done);
  });

  it('should register block event listener', (done) => {
    const blocks = [];
    (new Promise((resolve) => {
      let registeredListener = null;
      const fakeEventHub = createEventHub({/* peer */ }, {
        registerBlockEvent: (listener) => {
          registeredListener = listener;
          return testValues.listenerId;
        },
        connect: () => {
          if (registeredListener) {
            Promise.all(
              [
                Promise.resolve(testValues.block1),
                Promise.resolve(testValues.block2),
              ],
            ).then((results) => {
              results.forEach(result => registeredListener(result));
              resolve();
            });
          }
        },
      });
      const options = {
        log: createConsole(),
      };
      EventHub.registerBlockEvent({
        eventHub: fakeEventHub,
        listener: block => blocks.push(block),
        networkName: testValues.networkName,
        startBlock: testValues.startBlock,
      }, options);
    }).then(() => {
      assert.equal(blocks.length, 2);
      done();
    })
      .catch(done));
  });

  it('should disconnect after unregistering block event listener', () => {
    let unregisteredListenerId = -1;
    let disconnected = false;

    const fakeEventHub = createEventHub({/* peer */ }, {
      unregisterBlockEvent: (listenerId) => {
        unregisteredListenerId = listenerId;
      },
      disconnect: () => {
        disconnected = true;
      },
    });
    const options = {
      log: createConsole(),
    };
    EventHub.unregisterBlockEvent({
      eventHub: fakeEventHub,
      listenerId: testValues.listenerId,
      networkName: testValues.networkName,
    }, options);
    assert.equal(unregisteredListenerId, testValues.listenerId);
    assert.ok(disconnected);
  });
});

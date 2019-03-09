/*
 * DLTGateway\src\DLTGatewaySolution\NetworkListeners\FabricListener\test\fabricTests.js
 */
'use strict';

const assert = require('assert');
const eventHub = require('../fabric/eventHub.js');

const createFabricClient = (options = {}) => {
  const { isEnrolled = true } = options;
  return {
    newChannel: channelName => ({
      channelName: channelName,
      addPeer: peer => this.peer = peer,
      newChannelEventHub: peer => ({
        peer
      })
    }),
    newPeer: peerAddress => ({
      peerAddress
    }),
    newCryptoKeyStore: ({ path }) => ({ path }),
    newCryptoSuite: () => ({
      setCryptoKeyStore: keyStore => this.keyStore = keyStore
    }),
    newDefaultKeyValueStore: () => Promise.resolve(/* stateStore */ {}),

    setStateStore: stateStore => this.stateStore = stateStore,
    setCryptoSuite: cryptoSuite => this.cryptoSuite = cryptoSuite,

    getUserContext: () => Promise.resolve(/* user */ {
      isEnrolled: () => isEnrolled
    })
  };
};

// Create a fake console object to keep the real console clear.
const createConsole = () => ({
  info: () => { /* Discard the info. */ }
});

describe('eventHub', function () {
  it('should require a business network argument', function () {
    try {
      eventHub.create();
    } catch (err) {
      assert.ok(err);
    }
  });

  it('should create a Fabric client', function () {
    return eventHub.create({
      GUID: '35838015-ad4d-4d25-ba4c-dbba6f2a0224',
      CryptoMaterialDirectory: 'wallet'
    }, {
        createFabricClient: createFabricClient,
        console: createConsole()
      });
  });

  it('should verify user enrollment', function () {
    return eventHub.create({
      GUID: '35838015-ad4d-4d25-ba4c-dbba6f2a0224',
      Name: 'network 2434897',
      CryptoMaterialDirectory: 'wallet',
      Username: 'user3123'
    }, {
        createFabricClient: createFabricClient.bind(null, { isEnrolled: false }),
        console: createConsole()
      }).
      catch(err => assert.equal(err, '[network 2434897] Failed to verify enrollment for user \"user3123\".'));
  });

});
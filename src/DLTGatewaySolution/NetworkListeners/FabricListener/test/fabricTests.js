/*
 * FabricListener\test\fabricTests.js
 */
'use strict';

const assert = require('assert');
const eventHub = require('../fabric/eventHub.js');

const createFabricClient = options => {
  const {
    isEnrolled = true,
    getUserContext = () => Promise.resolve(/* user */ {
      isEnrolled: () => isEnrolled
    }),
    newChannelEventHub = peer => ({
      peer
    })
  } = options || {};
  return {
    newChannel: channelName => ({
      channelName: channelName,
      addPeer: peer => this.peer = peer,
      newChannelEventHub
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

    getUserContext
  };
};

// Create a fake console object to keep the real console clear.
const createConsole = () => ({
  info: () => { /* Discard the info. */ }
});

describe('eventHub', function () {
  it('should create a new channel event hub', done => {
    const fakeEventHub = { 'someProp': 'some value' };
    const businessNetwork = {
      GUID: '35838015-ad4d-4d25-ba4c-dbba6f2a0224',
      Name: 'network 2434897',
      CryptoMaterialDirectory: 'wallet'
    };
    const options = {
      createFabricClient: createFabricClient.bind(null, {
        newChannelEventHub: () => fakeEventHub
      }),
      log: createConsole()
    };
    eventHub.create(businessNetwork, options).then(({ eventHub }) => {
      assert.deepStrictEqual(eventHub, fakeEventHub);
      done();
    })
      .catch(done);
  });

  it('should catch un-enrolled user', done => {
    const businessNetwork = {
      GUID: '35838015-ad4d-4d25-ba4c-dbba6f2a0224',
      Name: 'network 2434897',
      CryptoMaterialDirectory: 'wallet',
      Username: 'user3123'
    };
    const options = {
      createFabricClient: createFabricClient.bind(null, { isEnrolled: false }),
      log: createConsole()
    };
    eventHub.create(businessNetwork, options)
      .then(() => Promise.resolve(), err => Promise.resolve(err))
      .then(msg => {
        assert.equal(msg, '[network 2434897] Failed to verify enrollment for user "user3123".');
        done();
      })
      .catch(done);
  });

  it('should catch missing user context', done => {
    const businessNetwork = {
      GUID: '35838015-ad4d-4d25-ba4c-dbba6f2a0224',
      Name: 'network 2434897',
      CryptoMaterialDirectory: 'wallet',
      Username: 'user3123'
    };
    const err = 'Failed to get user context.';
    const options = {
      createFabricClient: createFabricClient.bind(null, {
        getUserContext: () => Promise.reject(err)
      }),
      log: createConsole()
    };
    eventHub.create(businessNetwork, options)
      .then(() => Promise.resolve(), err => Promise.resolve(err))
      .then(msg => {
        assert.equal(msg, err);
        done();
      })
      .catch(done);
  });

});
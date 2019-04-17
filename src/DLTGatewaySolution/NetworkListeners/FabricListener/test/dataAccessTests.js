/*
 * FabricListener\test\dataAccessTests.js
 */
const assert = require('assert');
const db = require('../dataAccess');
const config = require('../dataAccess/config');

const testValues = {
  frameworkName: 'hlf423987',
  networkName: 'iot4239847',
  blockNumber: '3298',
};

describe('businessNetworks.search', () => {
  it('should require framework name', (done) => {
    db.businessNetworks.search({})
      .then(() => {
        assert.fail('Expected exception is not thrown.');
      }, (err) => {
        assert.equal(err.message, 'Argument exception: frameworkName is required but missing.');
        done();
      })
      .catch(done);
  });

  it('should query all networks using a framework name when a network name is not specified', (done) => {
    const queries = [];
    const options = {
      query: (sql) => {
        queries.push(sql);
        return Promise.resolve({
          recordset: [{}],
        });
      },
      convertToObject: () => ([{}]),
      logger: {
        log: () => { }, error: console.error.bind(null),
      },
    };
    db.businessNetworks.search({ frameworkName: testValues.frameworkName }, options)
      .then(() => {
        assert.equal(queries.length, 1);
        assert.ok(queries[0].length > 0);
        const queryIncludesFrameworkName = queries[0].toUpperCase().includes('F.NAME =');
        assert.ok(queryIncludesFrameworkName);
        const queryExcludesNetworkName = !queries[0].toUpperCase().includes('N.NAME =');
        assert.ok(queryExcludesNetworkName);
        done();
      })
      .catch(done);
  });
});

describe('transactionHistory.add', () => {
  it('should save each transaction and each action in a block', (done) => {
    const options = {
      dbConnect: () => Promise.resolve(),
      poolRequest: () => {
        const request = {
          input: () => request,
          execute: () => Promise.resolve({ rowsAffected: [1] }),
        };
        return request;
      },
      logger: {
        info: () => { },
        error: console.error.bind(null),
      },
    };
    const transactions = [{
      payload: {
        data: {
          actions: [
            '{"1":"2"}',
            '{"3":"4"}',
            '{"5":"6"}',
          ],
        },
      },
    },
    {
      payload: {
        data: {
          actions: [
            '{"7":"8"}',
            '{"9":"10"}',
          ],
        },
      },
    }];
    db.transactionHistory.add({
      networkName: testValues.networkName,
      blockNumber: testValues.blockNumber,
      transactions,
      entirePayload: JSON.stringify({ transactions }),
    }, options)
      .then((countAffected) => {
        console.log(JSON.stringify(countAffected));
        assert.equal(countAffected, 5);
        done();
      })
      .catch(done);
  });
});

describe('config.parse', () => {
  it('should extract the server attribute', () => {
    const dummyServer = 'mssql2019';
    const { server } = config.parse(`Server=${dummyServer}`);
    assert.equal(server, dummyServer);
  });
  it('should extract the database attribute', () => {
    const dummyDatabase = 'some.database.name';
    const { database } = config.parse(`Server=dummyServer;Database=${dummyDatabase}`);
    assert.equal(database, dummyDatabase);
  });
  it('should extract the user attribute', () => {
    const dummyUser = 'user5';
    const { 'user id': user } = config.parse(`Server=dummyServer;Database=dummyDatabase;User Id=${dummyUser}`);
    assert.equal(user, dummyUser);
  });
  it('should extract the password attribute', () => {
    const dummyPassword = 'Password***';
    const { password } = config.parse(`Server=dummyServer;Database=dummyDatabase;User Id=dummyUser;Password=${dummyPassword}`);
    assert.equal(password, dummyPassword);
  });
});

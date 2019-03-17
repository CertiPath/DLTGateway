/*
 * FabricListener\test\dataAccessTests.js
 */
const assert = require('assert');
const db = require('../dataAccess');

const testValues = {
  frameworkName: 'hlf423987',
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

/*
 * FabricListener\test\dataAccessTests.js
 */
const assert = require('assert');
const db = require('../dataAccess');

describe('businessNetworks.search', () => {
  it('should require framework name', (done) => {
    db.businessNetworks.search({ })
      .then((networks) => {
        assert.equal(networks.length, 1);
        done();
      })
      .catch(done);
  });
});

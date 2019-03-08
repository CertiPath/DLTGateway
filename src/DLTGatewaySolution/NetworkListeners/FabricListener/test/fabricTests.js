'use strict';

const assert = require('assert');
const eventHub = require('../fabric/eventHub.js');

describe('eventHub', function () {
  it('should require a valid business network', function () {
    return eventHub.create()
      .catch(err => {
        // The `create` function should return a promise which rejects
        //  with an error indicating that the argument must not be null.
        assert.ok(err);
      });
  })
});
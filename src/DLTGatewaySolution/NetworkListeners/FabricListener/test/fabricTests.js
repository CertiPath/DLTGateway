'use strict';

const assert = require('assert');
const eventHub = require('../fabric/eventHub.js');

describe('eventHub', function () {
  it('should require an argument.', function () {
    try {
      eventHub.create();
    } catch (err) {
      assert.ok(err);
    }
  })
});
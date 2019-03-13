/*
 * NodeBackgroundService\dataAccess\index.js
 */
'use strict';

const query = require('./query');

// Each individual table has its own js file with pluralized name.
// For example: dbo.setting --> settings.js
const settings = require('./settings');
const businessNetworks = require('./businessNetworks');
const transactionHistory = require('./transactionHistory');

exports.connect = query.connect;
exports.disconnect = query.disconnect;
exports.query = query.query;

exports.settings = settings;
exports.businessNetworks = businessNetworks;
exports.transactionHistory = transactionHistory;

/*
 * FabricListener\index.js
 */
'use strict';

require('dotenv').config();
const fabric = require('./fabric');

const targetNetworkName = process.env.TARGET_BUSINESS_NETWORK_NAME;

console.config().then(() => fabric.connect(targetNetworkName));

/*
 * FabricListener\index.js
 */
require('dotenv').config();
const fabric = require('./fabric');

const targetNetworkName = process.env.TARGET_BUSINESS_NETWORK_NAME;

fabric.connect(targetNetworkName);

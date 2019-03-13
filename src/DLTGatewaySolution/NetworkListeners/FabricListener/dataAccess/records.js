/*
 * FabricListener\dataAccess\records.js
 */
'use strict';

const fromRecordset = recordset => {
    const records = [];
    for (let i = 0; i < recordset.length; i++) {
        records.push(recordset[i]);
    }
    return records;
};

const countAffected = result => {
    return result.rowsAffected.reduce((prev, curr) => { return prev + curr; }, 0);
};

exports.fromRecordset = fromRecordset;
exports.countAffected = countAffected;

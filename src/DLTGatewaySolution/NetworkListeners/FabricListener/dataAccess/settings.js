'use strict';

const db = require('./query');
const records = require('./records');

const stringToBoolean = setting => {

    if (setting.ValueType === 'bool') {
        const BOOLEAN_VARIANCES = {
            'true': true,
            'TRUE': true,
            '1': true,
            'false': false,
            'FALSE': false,
            '0': false,
            'NULL': false
        };
        setting.Value = BOOLEAN_VARIANCES[setting.Value];
    }
    return setting;
};
const search = ({ settingType }) => db.query(`
SELECT S.GUID, 
       S.Name, 
       S.DisplayName, 
       S.SettingTypeGUID, 
       S.Value, 
       S.ValueType, 
       S.valuereference, 
       S.TooltipText, 
       S.[Order], 
       S.UserEditable, 
       S.Required
FROM   Setting AS S 
       INNER JOIN SettingType AS T 
               ON S.SettingTypeGUID = T.GUID
WHERE  T.Name = '${settingType}'
`)
    .then(result => {
        return Promise.resolve(records.fromRecordset(result.recordset).map(stringToBoolean));
    })

exports.search = search;
const moment = require('moment');

module.exports = modifyDate => logEntry => {
    const now = moment();

    logEntry.timestamp = modifyDate ? modifyDate(now) : now;

    return logEntry;
};

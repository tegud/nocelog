"use strict";

const transports = {
    'udp': require('./transports/udp'),
    'tcp': require('./transports/tcp')
};

module.exports = function(config) {
    const logLevels = [
        'info',
        'warn',
        'error'
    ];

    const subscribers = [];
    const modifiers = [];

    const logEntries = {
        addLevelToAdditionalFields: () => {
            modifiers.push(logEntry => {
                logEntry.fields.level = logEntry.level;

                return logEntry;
            });

            return logEntries;
        },
        subscribe: (transport, options) => {
            if(typeof transport === 'function') {
                return subscribers.push(transport);
            }
            subscribers.push(transports[transport](options))
        }
    };

    config(logEntries);

    function log(level, logFields) {
        const logEntry = modifiers.reduce((logItem, modifier) => modifier(logItem), {
            level: level,
            fields: logFields
        });
        const formattedLogEntry = logEntry.fields;
        subscribers.forEach(subscriber => subscriber(formattedLogEntry));
    }

    return logLevels.reduce((api, level) => {
        api[level] = log.bind(undefined, level);

        return api;
    }, {});
};

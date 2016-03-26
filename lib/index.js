"use strict";

const transports = {
    'udp': require('./transports/udp'),
    'tcp': require('./transports/tcp')
};

const transportLookup = {
    'function': transport => transport,
    'string': (transport, options) => transports[transport](options)
};

module.exports = function(config) {
    const logLevels = [
        'info',
        'warn',
        'error'
    ];

    const subscribers = [];
    const modifiers = [];

    const logEntries = [
        'addFields',
        'addLevelToAdditionalFields',
        'addLevelToTags',
        'addTagsToAdditionalFields'
    ].reduce((api, formatter) => {
        api[formatter] = config => {
            modifiers.push(require(`./formatters/${formatter}`)(config));

            return logEntries;
        };

        return api;
    }, {
        subscribe: (transport, options) => {
            subscribers.push(transportLookup[typeof transport](transport, options));

            return logEntries;
        }
    });

    config(logEntries);

    function log(level, logFields) {
        const logEntry = modifiers.reduce((logItem, modifier) => modifier(logItem), {
            level: level,
            fields: logFields,
            tags: []
        });
        const formattedLogEntry = logEntry.fields;
        subscribers.forEach(subscriber => subscriber(formattedLogEntry));
    }

    return logLevels.reduce((api, level) => {
        api[level] = log.bind(undefined, level);

        return api;
    }, {});
};

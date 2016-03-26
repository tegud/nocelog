"use strict";

const dgram = require('dgram');

module.exports = function(config) {
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
            const udpClient = dgram.createSocket("udp4");

            subscribers.push(data => {
                const message = JSON.stringify(data);

                udpClient.send(new Buffer(message), 0, message.length, options.port, options.host);
            });
        }
    };

    config(logEntries);

    return {
        info: (logFields) => {
            const logEntry = modifiers.reduce((logItem, modifier) => modifier(logItem), {
                level: 'info',
                fields: logFields
            });
            const formattedLogEntry = logEntry.fields;
            subscribers.forEach(subscriber => subscriber(formattedLogEntry));
        }
    };
};

"use strict";

const dgram = require('dgram');

module.exports = function(config) {
    const subscribers = [];

    const logEntries = {
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
        info: (logItem) => subscribers.forEach(subscriber => subscriber(logItem))
    };
};

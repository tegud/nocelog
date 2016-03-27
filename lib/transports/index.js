"use strict";

const transports = {
    'udp': require('./udp'),
    'tcp': require('./tcp')
};

const transportLookup = {
    'function': transport => transport,
    'string': (transport, options) => transports[transport](options)
};

module.exports = {
    'subscribers': {
        register: (pipeline, module, transport, config) => pipeline.subscribers.push(transportLookup[typeof transport](transport, config)),
        modules: [
            'subscribe'
        ]
    }
};

"use strict";


const transports = {
    'udp': require('./transports/udp'),
    'tcp': require('./transports/tcp')
};

const transportLookup = {
    'function': transport => transport,
    'string': (transport, options) => transports[transport](options)
};

function clone(objectToClone) {
    return JSON.parse(JSON.stringify(objectToClone));
}

function log(pipelines, level, logFields) {
    pipelines.forEach((pipeline) => {
        const logEntry = pipeline.formatters.reduce((logItem, modifier) => modifier(logItem), {
            level: level,
            fields: clone(logFields),
            tags: []
        });
        const formattedLogEntry = logEntry.fields;
        pipeline.subscribers.forEach(subscriber => {
            subscriber(formattedLogEntry);
        });
    });
}

module.exports = function(config) {
    const logLevels = [
        'info',
        'warn',
        'error'
    ];

    const handlers = {
        'formatters': {
            register: (pipeline, module, config) => { pipeline.formatters.push(require(`./formatters/${module}`)(config))},
            modules: [
                'addFields',
                'addLevelToAdditionalFields',
                'addLevelToTags',
                'addTagsToAdditionalFields'
            ]
        },
        'subscribers': {
            register: (pipeline, module, transport, config) => pipeline.subscribers.push(transportLookup[typeof transport](transport, config)),
            modules: [
                'subscribe'
            ]
        }
    };

    function generateApi(handlers, pipeline) {
        return Object.keys(handlers).reduce((api, handler) => {
            api = handlers[handler].modules.reduce((api, module) => {
                api[module] = function () {
                    const args = [module].concat(arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
                    handlers[handler].register(pipeline, ...args);

                    return generateApi(handlers, pipeline);
                };

                return api;
            }, api);

            return api;
        }, {});
    }

    function generateNewPipelineApi(handlers, pipelines) {
        return Object.keys(handlers).reduce((api, handler) => {
            api = handlers[handler].modules.reduce((api, module) => {
                api[module] = function () {
                    const pipeline = {
                        formatters: [],
                        subscribers: []
                    };

                    pipelines.push(pipeline);

                    const args = [module].concat(arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
                    handlers[handler].register(pipeline, ...args);

                    return generateApi(handlers, pipeline);
                };

                return api;
            }, api);

            return api;
        }, {});
    }

    function rootLevelApi(handlers) {
        const pipelines = [];
        const configurationApi = generateNewPipelineApi(handlers, pipelines);

        return {
            pipelines: pipelines,
            config: configurationApi
        };
    }

    const pipelinesAndConfig = rootLevelApi(handlers);

    config(pipelinesAndConfig.config);

    return logLevels.reduce((api, level) => {
        api[level] = log.bind(undefined, pipelinesAndConfig.pipelines, level);

        return api;
    }, {});
};

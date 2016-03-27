"use strict";

const _ = require('lodash');

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

const handlers = _.merge({}, ...['formatters', 'transports'].map(handler => require(`./${handler}`)));

function buildHandlers(handlers, builder) {
    return Object.keys(handlers).reduce((api, handler) =>
        handlers[handler].modules.reduce(builder.bind(undefined, handler), api), {});
}

function generateApi(handlers, pipeline) {
    return buildHandlers(handlers, (handler, api, module) => {
        api[module] = function () {
            const args = [module].concat(arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
            handlers[handler].register(pipeline, ...args);

            return generateApi(handlers, pipeline);
        };

        return api;
    });
}

function generateNewPipelineApi(handlers) {
    const pipelines = [];

    return {
        api: buildHandlers(handlers, (handler, api, module) => {
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
        }),
        pipelines: pipelines
    };
}

module.exports = function(config) {
    const logLevels = [
        'info',
        'warn',
        'error'
    ];

    const configApiAndPipelines = generateNewPipelineApi(handlers);

    config(configApiAndPipelines.api);

    return logLevels.reduce((api, level) => {
        api[level] = log.bind(undefined, configApiAndPipelines.pipelines, level);

        return api;
    }, {});
};

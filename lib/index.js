"use strict";

const generateNewPipelineApi = require('./configurationApi');
const utilities = require('./utilities');
const _ = require('lodash');

function log(pipelines, level, logFields) {
    pipelines.forEach((pipeline) => {
        const logEntry = pipeline.formatters.reduce((logItem, modifier) => modifier(logItem), {
            level: level,
            fields: utilities.clone(logFields),
            tags: []
        });
        const formattedLogEntry = logEntry.fields;
        pipeline.subscribers.forEach(subscriber => {
            subscriber(formattedLogEntry);
        });
    });
}

const logLevels = [
    'info',
    'warn',
    'error'
];

const handlerLocations = ['formatters', 'transports'];
const handlerModules = _.merge({}, ...handlerLocations.map(handler => require(`./${handler}`)));

module.exports = function(config) {
    const configApiAndPipelines = generateNewPipelineApi(handlerModules);

    config(configApiAndPipelines.api);

    return logLevels.reduce((api, level) => {
        api[level] = log.bind(undefined, configApiAndPipelines.pipelines, level);

        return api;
    }, {});
};

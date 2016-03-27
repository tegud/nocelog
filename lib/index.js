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

module.exports = function(config) {
    const logLevels = [
        'info',
        'warn',
        'error'
    ];

    const configApiAndPipelines = generateNewPipelineApi(_.merge({}, ...['formatters', 'transports'].map(handler => require(`./${handler}`))));

    config(configApiAndPipelines.api);

    return logLevels.reduce((api, level) => {
        api[level] = log.bind(undefined, configApiAndPipelines.pipelines, level);

        return api;
    }, {});
};

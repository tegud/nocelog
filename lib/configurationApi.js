"use strict";

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

module.exports = function generateNewPipelineApi(handlers) {
    const pipelines = [];

    return {
        api: buildHandlers(handlers, (handler, api, module) => {
            api[module] = function () {
                const pipeline = Object.keys(handlers).reduce((pipeline, handler) => {
                    pipeline[handler] = [];
                    return pipeline;
                }, {});

                pipelines.push(pipeline);

                const args = [module].concat(arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
                handlers[handler].register(pipeline, ...args);

                return generateApi(handlers, pipeline);
            };

            return api;
        }),
        pipelines: pipelines
    };
};

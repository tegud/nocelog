"use strict";

module.exports = {
    'formatters': {
        register: (pipeline, module, config) => { pipeline.formatters.push(require(`./${module}`)(config))},
        modules: [
            'addFields',
            'addLevelToAdditionalFields',
            'addLevelToTags',
            'addTagsToAdditionalFields'
        ]
    }
};

module.exports = config => logEntry =>
    Object.keys(config).reduce((logEntry, key) => {
        logEntry.fields[key] = typeof config[key] === 'function' ? config[key](logEntry) : config[key];
        return logEntry;
    }, logEntry);

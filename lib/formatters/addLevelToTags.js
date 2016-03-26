module.exports = logEntry => {
    logEntry.tags.push(logEntry.level);

    return logEntry;
};

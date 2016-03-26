module.exports = logEntry => {
    logEntry.fields.tags = logEntry.tags;

    return logEntry;
};

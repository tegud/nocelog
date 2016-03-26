module.exports = () => logEntry => {
    logEntry.fields.level = logEntry.level;

    return logEntry;
};

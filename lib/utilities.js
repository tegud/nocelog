module.exports.clone = function clone(objectToClone) {
    return JSON.parse(JSON.stringify(objectToClone));
}

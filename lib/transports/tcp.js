const net = require('net');

module.exports = options => {
    const client = new net.Socket();

    client.connect(options.port, options.host);

    return data => client.write(JSON.stringify(data));
};

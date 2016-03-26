const dgram = require('dgram');

module.exports = options => {
    const udpClient = dgram.createSocket("udp4");

    return data => {
        const message = JSON.stringify(data);

        udpClient.send(new Buffer(message), 0, message.length, options.port, options.host);
    };
};

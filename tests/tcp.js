"use strict";

const should = require('should');
const Logger = require('../lib/');
const net = require('net');

function bindToTcpAndHandleMessage(port, messageHandler) {
	var server = net.createServer(socket =>
		socket.on('data', msg => {
			var data = msg.toString('utf-8');
			var parsedData = JSON.parse(data);

			messageHandler(parsedData);

			server.close();
		}));

	server.listen(port, '0.0.0.0');
}

describe('sends logged event to specified TCP port', function() {
    it('logs message', done => {
        const log = new Logger(logEvents => logEvents
            .subscribe('tcp', { host: 'localhost', port: 1234 }));

		bindToTcpAndHandleMessage(1234, parsedData => {
    		parsedData.should.be.eql({
    			message: 'test log message'
    		});
            done();
        });

        log.info({ message: 'test log message' });
    });
});

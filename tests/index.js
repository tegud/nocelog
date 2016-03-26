"use strict";

const should = require('should');
const Logger = require('../lib/');
const dgram = require('dgram');

function bindToUdpAndHandleMessage(port, messageHandler) {
    var udpClient = dgram.createSocket("udp4");

	udpClient.bind(1234);

	udpClient.on("message", function messageReceived(msg) {
		var data = msg.toString('utf-8');
		var parsedData = JSON.parse(data);

		messageHandler(parsedData);

		udpClient.close();
	});
}

describe('sends logged event to specified UDP port', function() {
    it('logs message', done => {
        const log = new Logger(logEvents => logEvents
            .subscribe('udp', { host: 'localhost', port: 1234 }));

		bindToUdpAndHandleMessage(1234, parsedData => {
    		parsedData.should.be.eql({
    			message: 'test log message'
    		});
            done();
        });

        log.info({ message: 'test log message' });
    });

    describe('logs message with level', () => {
        it('info', done => {
            const log = new Logger(logEvents => logEvents
                .addLevelToAdditionalFields()
                .subscribe('udp', { host: 'localhost', port: 1234 }));

                bindToUdpAndHandleMessage(1234, parsedData => {
                    parsedData.should.be.eql({
                        message: 'test log message',
                        level: 'info'
                    });
                    done();
                });

                log.info({ message: 'test log message', level: 'info' });
        });

        it('warn', done => {
            const log = new Logger(logEvents => logEvents
                .addLevelToAdditionalFields()
                .subscribe('udp', { host: 'localhost', port: 1234 }));

                bindToUdpAndHandleMessage(1234, parsedData => {
                    parsedData.should.be.eql({
                        message: 'test log message',
                        level: 'warn'
                    });
                    done();
                });

                log.warn({ message: 'test log message', level: 'warn' });
        });


        it('error', done => {
            const log = new Logger(logEvents => logEvents
                .addLevelToAdditionalFields()
                .subscribe('udp', { host: 'localhost', port: 1234 }));

                bindToUdpAndHandleMessage(1234, parsedData => {
                    parsedData.should.be.eql({
                        message: 'test log message',
                        level: 'error'
                    });
                    done();
                });

                log.error({ message: 'test log message', level: 'error' });
        });
    });
});

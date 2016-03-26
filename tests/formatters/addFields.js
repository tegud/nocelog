"use strict";

const should = require('should');
const Logger = require('../../lib/');

describe('addFields formatters', function() {
    it('sets literal values', done => {
        const log = new Logger(logEvents => logEvents
            .addFields({ type: "my_logging" })
            .subscribe(loggedData => {
                loggedData.should.be.eql({ message: 'test log message', type: 'my_logging' });

                done();
            }));

            log.info({ message: 'test log message' });
    });

    it('sets result of function values', done => {
        const log = new Logger(logEvents => logEvents
            .addFields({ type: logEntry => `my_logging_${logEntry.level}` })
            .subscribe(loggedData => {
                loggedData.should.be.eql({ message: 'test log message', type: 'my_logging_info' });

                done();
            }));

            log.info({ message: 'test log message' });
    });
});

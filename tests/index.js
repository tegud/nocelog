"use strict";

const should = require('should');
const Logger = require('../lib/');

describe('sends logged events', function() {
    it('logs message', done => {
        const log = new Logger(logEvents => logEvents
            .subscribe(loggedData => {
                loggedData.should.be.eql({
                    message: 'test log message'
                });

                done();
            }));

            log.info({ message: 'test log message' });
    });

    it('logs message to multiple subscribers', done => {
        let firstSubscriberCalled = false;

        const log = new Logger(logEvents => logEvents
            .subscribe(loggedData => {
                firstSubscriberCalled = true;
            })
            .subscribe(loggedData => {
                firstSubscriberCalled.should.be.eql(true);

                done();
            }));

            log.info({ message: 'test log message' });
    });

    describe('logs message with level', () => {
        it('info', done => {
            const log = new Logger(logEvents => logEvents
                .addLevelToAdditionalFields()
                .subscribe(loggedData => {
                    loggedData.should.be.eql({
                        message: 'test log message',
                        level: 'info'
                    });

                    done();
                }));

                log.info({ message: 'test log message' });
        });

        it('warn', done => {
            const log = new Logger(logEvents => logEvents
                .addLevelToAdditionalFields()
                .subscribe(loggedData => {
                    loggedData.should.be.eql({
                        message: 'test log message',
                        level: 'warn'
                    });

                    done();
                }));

                log.warn({ message: 'test log message' });
        });


        it('error', done => {
            const log = new Logger(logEvents => logEvents
                .addLevelToAdditionalFields()
                .subscribe(loggedData => {
                    loggedData.should.be.eql({
                        message: 'test log message',
                        level: 'error'
                    });

                    done();
                }));

                log.error({ message: 'test log message' });
        });
    });
});

"use strict";

const should = require('should');
const proxyquire = require('proxyquire');

const moment = require('moment');

function FakeMoment() {
    let fakeCurrentDate;

    return {
        clear: () => fakeCurrentDate = undefined,
        setDate: date => new Promise(resolve => resolve(fakeCurrentDate = date)),
        moment: date => {
            if(!date && fakeCurrentDate) {
                return moment(fakeCurrentDate);
            }

            return moment(date);
        }
    }
};

const fakeMoment = new FakeMoment();

const Logger = proxyquire('../../lib/', {
    './formatters': proxyquire('../../lib/formatters/', {
        './addTimestamp': proxyquire('../../lib/formatters/addTimestamp', {
            'moment': fakeMoment.moment
        })
    })
});

describe('timestamp formatter', function() {
    it('sets current time by default', done => {
        fakeMoment.setDate('2016-03-14T09:11:23');

        const log = new Logger(logEvents => logEvents
            .addTimestamp()
            .addFields({
                timestamp: logEvent => logEvent.timestamp.format()
            })
            .subscribe(loggedData => {
                loggedData.timestamp.should.be.eql('2016-03-14T09:11:23+00:00');

                done();
            }));

            log.info({ message: 'test log message' });
    });

    it('executes provided function and sets timestamp to result', done => {
        fakeMoment.setDate('2016-03-15T09:11:23');

        const log = new Logger(logEvents => logEvents
            .addTimestamp(now => now.add(1, 'd'))
            .addFields({
                timestamp: logEvent => logEvent.timestamp.format()
            })
            .subscribe(loggedData => {
                loggedData.timestamp.should.be.eql('2016-03-16T09:11:23+00:00');

                done();
            }));

            log.info({ message: 'test log message' });
    });
});

"use strict";

const should = require('should');
const Logger = require('../../lib/');

describe('level formatters', function() {
    it('can be set as additional field', done => {
        const log = new Logger(logEvents => logEvents
            .addLevelToAdditionalFields()
            .subscribe(loggedData => {
                loggedData.level.should.be.eql('info');

                done();
            }));

            log.info({ message: 'test log message' });
    });

    it('can be set as a tag', done => {
        const log = new Logger(logEvents => logEvents
            .addLevelToTags()
            .addTagsToAdditionalFields()
            .subscribe(loggedData => {
                loggedData.tags.should.containEql('info');

                done();
            }));

            log.info({ message: 'test log message' });
    });
});

var TextAnalytic = require('../textanalytics');
var assert = require('assert');


describe('constructor', function () {
    it('should throw on undefined config', function () {
        assert.throws(() => new TextAnalytic(), Error);
    });

});
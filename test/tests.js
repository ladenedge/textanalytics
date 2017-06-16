var TextAnalytic = require('../textanalytics');
var assert = require('assert');


describe('constructor', function () {
    it('should throw on undefined config', function () {
        assert.throws(() => new TextAnalytic(), Error);
    });

    it('should throw on null config', function () {
        assert.throws(() => new TextAnalytic(null), Error);
    });

    it('should throw when config is not an object', function () {
        assert.throws(() => new TextAnalytic(1), Error);
    });

    it('should throw on missing endpoint property', function () {
        assert.throws(
            () => {
                var config = { apikey: 'foo' };
                new TextAnalytic(config);
            }, Error);
    });

    it('should throw on missing apikey property', function () {
        assert.throws(
            () => {
                var config = { endpoint: 'foo' };
                new TextAnalytic(config);
            }, Error);
    });

    it('should throw on null endpoint property', function () {
        assert.throws(
            () => {
                var config = {
                    endpoint: null,
                    apikey: 'foo'
                };
                new TextAnalytic(config);
            }, Error);
    });

    it('should throw on null apikey property', function () {
        assert.throws(
            () => {
                var config = {
                    endpoint: 'foo',
                    apikey: null
                };
                new TextAnalytic(config);
            }, Error);
    });
});


describe('analyze', function () {
    var config = {
        endpoint: ' https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment ',
        apikey: ' a887bd712a8c4aed99e1aa09732ecb74 ',
        verbose: false
    };
    it('should throw on undefined string', function () {
        assert.throws(() => {
            var textanalytics = new TextAnalytic(config);
            textanalytics.analyze();
        }, Error);
    });

    it('should throw on null string', function () {
        assert.throws(() => {
            var textanalytics = new TextAnalytic(config);
            textanalytics.analyze(null, (err, rsp) => { });
        }, Error);
    });
    it('should throw when text is not a string', function () {
        assert.throws(() => {
            var textanalytics = new TextAnalytic(config);
            textanalytics.analyze(1, (err, rsp) => { });
        }, Error);
    });
    it('should throw on undefined callback', function () {
        assert.throws(() => {
            var textanalytics = new TextAnalytic(config);
            textanalytics.analyze('foo');
        }, Error);
    });
    it('should throw on null callback', function () {
        assert.throws(() => {
            var textanalytics = new TextAnalytic(config);
            textanalytics.analyze('foo', null);
        }, Error);
    });
    it('should throw when callback is not a function', function () {
        assert.throws(() => {
            var textanalytics = new TextAnalytic(config);
            textanalytics.analyze('foo', 1);
        }, Error);
    });


    var textanalytics = new TextAnalytic(config);
    textanalytics.analyze('This is not a real message', (err, rsp) => {
        if (err)
            return console.log(err);
        console.log(rsp);
    });


})
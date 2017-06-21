var TextAnalytic = require('../index');
var assert = require('assert');
var sinon = require('sinon');
var request = require('request');

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
    var config = { };

    it('should throw on missing apikey property', function () {
        assert.throws(
            () => {
                new TextAnalytic(config);
            }, Error);
    });
    it('should throw on null apikey property', function () {
        config = {
            apikey: null
        };
        assert.throws(
            () => {
                new TextAnalytic(config);
            }, Error);
    });
    it('should throw on whitespace apikey property', function () {
        config = {
            apikey: '   '
        };
        assert.throws(
            () => {
                new TextAnalytic(config);
            }, Error);
    });

    it('should set the state', function () {
        var config = {
            apikey: 'bar'
        };
        assert.equal(new TextAnalytic(config).apikey, 'bar');
    });

    it('should set the proper endpoint', function () {
        var config = {
            apikey: 'bar'
        };
        assert.equal(new TextAnalytic(config).endpoint, 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0');
    });

});


describe('analyze', function () {
    var config = {
        apikey: 'bar',
    };
    var textanalytics = new TextAnalytic(config);
    beforeEach(function () {
        //A Sinon stub replaces the target function, so no need for DI
        this.post = sinon.stub(request, 'post');
    });
    afterEach(function () {
        request.post.restore();
    });

    it('should throw on undefined string', function () {
        assert.throws(() => {
            textanalytics.analyze();
        }, Error);
    });

    it('should throw on null string', function () {
        assert.throws(() => {
            textanalytics.analyze(null, (err, rsp) => { });
        }, Error);
    });
    it('should throw when text is not a string', function () {
        assert.throws(() => {
            textanalytics.analyze(1, (err, rsp) => { });
        }, Error);
    });
    it('should throw when text is all whitespace', function () {
        assert.throws(() => {
            textanalytics.analyze('   ', (err, rsp) => { });
        }, Error);
    });
    it('should throw on undefined callback', function () {
        assert.throws(() => {
            textanalytics.analyze('foo');
        }, Error);
    });
    it('should throw on null callback', function () {
        assert.throws(() => {
            textanalytics.analyze('foo', null);
        }, Error);
    });
    it('should throw when callback is not a function', function () {
        assert.throws(() => {
            textanalytics.analyze('foo', 1);
        }, Error);
    });

    it('should include error argument on error', function (done) {
        var err = new Error('Bad request');
        this.post.callsArgWith(2, err);
        textanalytics.analyze('Arbitrary message', (error, resp) => {
            assert.equal(error.message, 'Bad request');
            done();
        });
    });

    it('should throw when the Text Analytics API does not return a 200 OK status code', function (done) {
        var rsp = { statusCode: 400 };
        this.post.callsArgWith(2, null, rsp);
        textanalytics.analyze('Arbitrary message', (error, resp) => {
            assert.equal(error.message, 'Protocol Error');
            done();
        });
    });

    it('should throw when body is not an object', function (done) {
        var body = 1;
        this.post.callsArgWith(2, null, { statusCode: 200 }, body);
        textanalytics.analyze('Arbitrary message', (error, resp) => {
            assert.equal(error.message, 'Body must be an object');
            done();
        });
    });

    it('should return a null error in the callback when no error occurs', function (done) {
        var body = { output: 'foo' };
        this.post.callsArgWith(2, null, { statusCode: 200 }, body);
        textanalytics.analyze('Arbitrary message', (error, resp) => {
            assert.equal(error, null);
            done();
        });
    });

    it('should return the content of the API response in the second argument of the callback when no error occurs', function (done) {
        var body = [{ output: 'foo' }, { output: 'bar' }, { output: 'foobar' }];
        var expected = { sentiment: body[0], keyPhrases: body[1], languages: body[2] };
        this.post.onFirstCall().callsArgWith(2, null, { statusCode: 200 }, body[0]);
        this.post.onSecondCall().callsArgWith(2, null, { statusCode: 200 }, body[1]);
        this.post.onThirdCall().callsArgWith(2, null, { statusCode: 200 }, body[2]);
        textanalytics.analyze('Arbitrary message', (error, resp) => {
            assert.equal(resp.sentiment, expected.sentiment);
            assert.equal(resp.keyPhrases, expected.keyPhrases);
            assert.equal(resp.languages, expected.languages);
            done();
        });
    });



    it('should pass the configured url to request', function () {
        textanalytics.analyze('Arbitrary message', (error, resp) => { });
        assert.equal(this.post.firstCall.args[0], 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment');
        assert.equal(this.post.secondCall.args[0], 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases');
        assert.equal(this.post.thirdCall.args[0], 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/languages')
    });

    it('should pass the input string as JSON', function () {
        var sendText = 'Arbitrary message';
        textanalytics.analyze(sendText, (error, resp) => { });
        assert.equal(this.post.firstCall.args[1].json.documents[0].text, sendText);
    });

    it('should set API key in headers', function () {
        textanalytics.analyze('Arbitrary message', (error, resp) => { });
        assert.equal(this.post.firstCall.args[1].headers["Ocp-Apim-Subscription-Key"], 'bar');
    });

    it('should send language of input text', function () {
        textanalytics.analyze('Arbitrary message', (error, resp) => { });
        assert.equal(this.post.firstCall.args[1].json.documents[0].language, 'en');
    });

    it('should send ID of input text', function () {
        textanalytics.analyze('Arbitrary message', (error, resp) => { });
        assert.equal(this.post.firstCall.args[1].json.documents[0].id, '1');
    });

})
var TextAnalytic = require('../textanalytics');
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
    var config = { apikey: 'foo' };
    it('should throw on missing endpoint property', function () {
        assert.throws(
            () => {                
                new TextAnalytic(config);
            }, Error);
    });   
    it('should throw on missing apikey property', function () {
        config = { endpoint: 'foo' };
        assert.throws(
            () => {
                new TextAnalytic(config);
            }, Error);
    });
    it('should throw on null endpoint property', function () {
        config = {
            endpoint: null,
            apikey: 'foo'
        };
        assert.throws(
            () => {
                new TextAnalytic(config);
            }, Error);
    });
    it('should throw on whitespace endpoint property', function () {
        config = {
            endpoint: '    ',
            apikey: 'foo'
        };
        assert.throws(            
            () => {
                new TextAnalytic(config);
            }, Error);
    });
    it('should throw on null apikey property', function () {
        config = {
            endpoint: 'foo',
            apikey: null
        };
        assert.throws(
            () => {
                new TextAnalytic(config);
            }, Error);
    });
    it('should throw on whitespace apikey property', function () {
        config = {
            endpoint: 'foo',
            apikey: '   '
        };
        assert.throws(
            () => {
                new TextAnalytic(config);
            }, Error);
    });

    it('should set the state', function () {
        var config = {
            endpoint: 'foo',
            apikey: 'bar'
        };
        assert.equal(new TextAnalytic(config).endpoint, 'foo');
    });

});


describe('analyze', function () {
    var config = {
        endpoint: 'foo',
        apikey: 'bar',
        verbose: false
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
    it('should throw when text is all whitespace'), function () {
        assert.throws(() => {           
            textanalytics.analyze('   ', (err, rsp) => { });
        }, Error);
    }

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
        textanalytics.analyze("Arbitrary message", (error, resp) => {
            assert.equal(error.message, 'Bad request');
            done();
        });
    });  

    it('should throw when the Text Analytics API does not return a 200 OK status code', function (done) {
        var rsp = { statusCode: 400 };
        this.post.callsArgWith(2, null, rsp);
        textanalytics.analyze("Arbitrary message", (error, resp) => {
            assert.equal(error.message, 'Protocol Error');
            done();
        });
    });

    it('should throw when body is not an object', function (done) {
        var body = 1;
        this.post.callsArgWith(2, null, { statusCode: 200 }, body);
        textanalytics.analyze("Arbitrary message", (error, resp) => {
            assert.equal(error.message, 'Body must be an object');
            done();
        });
    });

    it('should return a null error in the callback when no error occurs', function (done) {
        var body = { output: 'foo' };
        this.post.callsArgWith(2, null, { statusCode: 200 }, body);
        textanalytics.analyze("Arbitrary message", (error, resp) => {
            assert.equal(error, null);
            done();
        });
    });

    it('should return the content of the API response in the second argument of the callback when no error occurs', function (done) {
        var body = { output: 'foo' };
        this.post.callsArgWith(2, null, { statusCode: 200 }, body);
        textanalytics.analyze("Arbitrary message", (error, resp) => {
            assert.equal(resp, body);
            done();
        });
    });
})
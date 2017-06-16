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
    config = { endpoint: 'foo' };
    it('should throw on missing apikey property', function () {
        assert.throws(
            () => {
                new TextAnalytic(config);
            }, Error);
    });
    config = {
        endpoint: null,
        apikey: 'foo'
    };
    it('should throw on null endpoint property', function () {
        assert.throws(
            () => {
                new TextAnalytic(config);
            }, Error);
    });
    config = {
        endpoint: '    ',
        apikey: 'foo'
    };
    it('should throw on whitespace endpoint property', function () {
        assert.throws(
            () => {
                new TextAnalytic(config);
            }, Error);
    });
    config = {
        endpoint: 'foo',
        apikey: null
    };
    it('should throw on null apikey property', function () {
        assert.throws(
            () => {
                new TextAnalytic(config);
            }, Error);
    });
    config = {
        endpoint: 'foo',
        apikey: '   '
    };
    it('should throw on whitespace apikey property', function () {
        assert.throws(
            () => {
                new TextAnalytic(config);
            }, Error);
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


    


})
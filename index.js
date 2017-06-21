var request = require('request');
var async = require('async');

/**
 * A callback to handle both successful and failed requests. 
 * @callback TextAnalytics~callback
 * @param {Error} err An Error object containing information about a failure, or null if the call succeeded.
 * @param {Object} rsp An object created from the body of the successful response.
 */

/**
 * Module for the Text Analytics analysis that handles http communication with Text Analytics API
 */
class TextAnalytics {

    /**
     * Constructs a TextAnalytics client
     * @param {Object} config Configuration for the module
     * @param {string} config.apikey Full api key for the Text Analytics API
     */
    constructor(config) {

        if (!config || config === null) {
            throw new Error('Null or undefined configuration data');
        }

        if (typeof config !== 'object') {
            throw new Error('Configuration data must be a javascript object');
        }

        if (!config.hasOwnProperty('apikey')) {
            throw new Error('Configuration missing "apikey" property');
        }

        if (config.apikey === null) {
            throw new Error('Apikey property is null');
        }

        config.apikey = config.apikey.trim();
        if (config.apikey === '') {
            throw new Error('Apikey property is only whitespace');
        }


        this.endpoint = 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0';
        this.apikey = config.apikey;
    }



    /**
     * Communicates with the Text Analytics API and calls the callback function with the results
     * @param {string} text Message that is sent to the Text Analytics API
     * @param {function} callback A response handler to be called when the function completes.
     */
    analyze(text, callback) {

        if (!text || text === null) {
            throw new Error('Null or undefined message');
        }

        if (typeof text !== 'string') {
            throw new Error('Message must be a string');
        }

        text = text.trim();
        if (text === '') {
            throw new Error('Message made entirely of whitespace');
        }

        if (!callback || callback === null) {
            throw new Error('Null or undefined callback');
        }

        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }

        var postData =
            {
                "documents":
                [{
                    "language": "en",
                    "id": "1",
                    "text": text
                }]
            };
        var options = {
            headers: {
                "Ocp-Apim-Subscription-Key": this.apikey,
            },
            json: postData
        }

        var results = multiRequest(this.endpoint, options, (error, body) => {

            if (error)
                return callback(error);
            callback(null, body);
        });
       

    }
}

/**
 * Helper function to handle asynchronous http requests
 * @param {string} endpoint base url endpoint
 * @param {object} options specifications for http request
 * @param {function} callback A response handler to be called when the function completes.
 */
 var multiRequest = function (endpoint, options, callback) {
    var endpoints =
        ['sentiment',
        'keyPhrases',
            'languages'];
    async.map(endpoints, (end, finished) => {
        request.post(`${endpoint}/${end}`, options, (error, resp, body) => {

            if (error)
                return finished(error);
            if (resp.statusCode !== 200)
                return finished(new Error(`Protocol Error`));
            if (typeof body !== 'object')
                return finished(new Error('Body must be an object'));
            finished(null, body);
        });
    }, (err, results) => {
        if (err)
            return callback(err);
        results = results.reduce((prev, cur, i) => {
            prev[endpoints[i]] = results[i];
            return prev;
        }, {});
        callback(null, results);
    });

};

module.exports = TextAnalytics;

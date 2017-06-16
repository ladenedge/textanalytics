var request = require('request');


/**
 * A callback to handle both successful and failed requests. 
 * @callback TextAnalytics~callback
 * @param {Error} error An Error object containing information about a failure, or null if the call succeeded.
 * @param {Object} resp An object created from the body of the successful response.
 */

/**
 * Module for the Text Analytics analysis that handles http communication with Text Analytics API
 */
module.exports = class TexAnalytics {

    /**
     * Constructs a TextAnalytics client
     * @param {Object} config Configuration for the module
     * @param {string} config.endpoint Full endpoint for the Text Analytics API
     * @param {string} config.apikey Full api key for the Text Analytics API
     */
    constructor(config) {

        if (!config || config === null) {
            throw new Error('Null or undefined configuration data');
        }

        if (typeof config !== 'object') {
            throw new Error('Configuration data must be a javascript object');
        }

        if (!config.hasOwnProperty('endpoint')) {
            throw new Error('Configuration missing "endpoint" property');
        }

        if (!config.hasOwnProperty('apikey')) {
            throw new Error('Configuration missing "apikey" property');
        }

        if (config.endpoint === null) {
            throw new Error('Endpoint property is null');
        }

        config.endpoint = config.endpoint.trim();
        if (config.endpoint === '') {
            throw new Error('Endpoint property is only whitespace');
        }

        if (config.apikey === null || config.apikey === '') {
            throw new Error('Apikey property is null or empty');
        }

        config.apikey = config.apikey.trim();
        if (config.apikey === '') {
            throw new Error('Apikey property is only whitespace');
        }


        this.endpoint = config.endpoint;
        this.apikey = config.apikey;
    }



    /**
     * 
     * @param {string} text Message that is sent to the Text Analytics API
     * @param {function} callback 
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


        request.post(this.endpoint, options, (error, resp, body) => {

            if (error)
                return callback(error);
            if (resp.statusCode !== 200)
                return callback(new Error('Protocol Error'));
            if (typeof body !== 'object')
                return callback(new Error('Body must be an object'));
            callback(null, body);
        });

    }
}



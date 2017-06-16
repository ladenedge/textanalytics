//Text Analytics API Proxy
//Handles http communiation with Text analytics API
var request = require('request');
module.exports = class TexAnalytics {
    constructor(config) {
        //First do error checking on the config object
        //TA20-TA28
        //TA20,TA21
        if (!config || config === null) {
            throw new Error('Null or undefined configuration data');
        }
        //TA22
        if (typeof config !== 'object') {
            throw new Error('Configuration data must be a javascript object');
        }
        //TA23
        if (!config.hasOwnProperty('endpoint')) {
            throw new Error('Configuration missing "endpoint" property');
        }
        //TA24
        if (!config.hasOwnProperty('apikey')) {
            throw new Error('Configuration missing "apikey" property');
        }
        //TA25, TA26
        config.endpoint = config.endpoint.trim();
        if (config.endpoint === null || config.endpoint ==='') {
            throw new Error('Endpoint property is null or empty');
        }
        //TA27, TA28
        config.apikey = config.apikey.trim();
        if (config.apikey === null || config.apikey === '') {
            throw new Error('Apikey property is null or empty');
        }



        //Then use config object to contact Text Analytics API
        //TA29-TA30
        this.endpoint = config.endpoint;
        this.apikey = config.apikey;
    }





    //main functionality of the TAAP component, analyze function
    analyze(text, callback) {
        //First error checking
        //TA3-TA9
        //TA3, TA4
        if (!text || text === null) {
            throw new Error('Null or undefined message');
        }
        //TA5
        if (typeof text !== 'string') {
            throw new Error('Message must be a string');
        }
        //TA6

        //TA7, TA8
        if (!callback || callback === null) {
            throw new Error('Null or undefined callback');
        }
        //TA9
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }

        //Then send string to TA-API for analysis
        //TA10
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
            method: 'POST',
            headers: {
                "Ocp-Apim-Subscription-Key": this.apikey,
                "Content-Type": "application / json",
                "Accept": "application / json"
            },
            json: postData
        }

        //Use request module to make HTTP calls
        //TA11
        request(this.endpoint, options, (error, resp, body) => {
            //Callback the results if there are results or an error if there is one
            //TA12-TA16
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



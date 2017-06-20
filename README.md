# Text Analytics API Proxy Module

This is a Node module to handle the client side of the Text Analytics API.

## Installation

Install the module from [NPM](https://www.npmjs.com/package/textanalytics)
    
    npm install textanalytics

# Usage

Including the module in the source defines the TextAnalytics class. The constructor
for the class takes a configuration object.

    var TextAnalytics = require('textanalytics');
    var textanalytics = new TextAnalytics(config);

The class offers [one function](https://github.com/ladenedge/textanalytics/wiki#TextAnalytics+analyze),
which requires a callback for success and error conditions:

    var callback = function(err, rsp) { };

Where *rsp* is the body of the (JSON) response in object form, and *err* is an `Error`
object containing information about the failure, or **null** if the call succeeded.

## Full Example

    var TextAnalytics = require('textanalytics');
    var config = {
      apikey : '(Example key)'
    };

    var textanalytics = new TextAnalytics(config);
    textanalytics.analyze('I love NodeJS.', (err, rsp) => {
      if (err)
        return console.log(err);
      console.log(rsp);
    });

## License

This module is licensed under the [MIT License](https://opensource.org/licenses/MIT).
Copyright &copy; 2017, Verint Inc.

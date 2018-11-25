'use strict';

let https = require('https');

// Replace the subscriptionKey string value with your valid subscription key.
let subscriptionKey = 'f60be38757e04d34a166794bfaa1e3e6';

let host = 'api.cognitive.microsoft.com';
let path = '/bing/v7.0/images/search';

// Query text
let term = 'luke skywalker';

let bing_image_search = function (search) {
    console.log('Search: ' + term);
    let request_params = {
        method: 'GET',
        hostname: host,
        path: path + '?q=' + encodeURIComponent(search),
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
        }
    };

    let req = https.request(request_params, response_handler);
    req.end();
}

// Set up response_handler identified by the parameter of the request initialized previously.
let response_handler = function (response) {
    let body = '';
    response.on('data', function (d) {
        body += d;
    });

    // On return of the response, this function parses and logs results to the console.
    response.on('end', function () {  
        const resultsArray = [JSON.parse(body)];

        console.log(resultsArray[0].value[0].thumbnailUrl);
    });
    response.on('error', function (e) {
        console.log('Error: ' + e.message);  // On the event of an error, log the message to the console.
    });
};

bing_image_search(term);
var util = require('util'),
  Bing = require('node-bing-api')({ accKey: 'f60be38757e04d34a166794bfaa1e3e6' }),
  searchBing = util.promisify(Bing.web.bind(Bing));

  Bing.images("Ninja Turtles", {
    count: 1,   // Number of results (max 50)
    offset: 0    // Skip first 3 result
    }, function(error, res, body){
      console.log(body);
    });
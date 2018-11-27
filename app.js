'use strict';
const express = require('express');
const app = express();
const axios = require('axios');
const People = require('./People');
//const path = require('path'); //---heroku---
const cors = require('cors');
const https = require ('https');
var casting = require('casting');
let subscriptionKey = '00d4c6d20695461aa94f7f442a1d3b57';
let host = 'api.cognitive.microsoft.com';
let path = '/bing/v7.0/images/search';

const port = process.env.PORT || 2000;

app.use(cors());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

//localhost:3000/getcharacter?search=Name

app.get('/getcharacter', (req, res) => {
  const name = req.query.search;

  const querystr = `https://swapi.co/api/people/?search=${name}`;
  var imageUrl = '';
  

  //f60be38757e04d34a166794bfaa1e3e6 API KEY BING
  let bing_image_search = function (search) {
    console.log('Search: ' + name);
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
        let resultsArray = [JSON.parse(body)];
        //console.log(resultsArray[0].value[0].webSearchUrl);
        imageUrl = resultsArray[0].value[0].webSearchUrl;
        //console.log(imageUrl);
        //imageUrl = casting.cast(String, resultsArray[0].value[0].thumbnailUrl);
    });
  };

  bing_image_search(name);

  axios
    .get(querystr)
    .then(response => {
      const people = new People({
        name: response.data.results[0].name,
        height: response.data.results[0].height,
        mass: response.data.results[0].mass,
        gender: response.data.results[0].gender,
        image: imageUrl
      });
      if (!people.name) {
        res.status(200).json('Not found');
        return;
      }
      people
        .save()
        .then(response => {
          res.status(200).json(response);
        })
        .catch(error => {
          res.status(400).json(error);
        });
    })
    .catch(error => {
      res.status(400).json(error);
    });
  });

//localhost:3000/getallpeople
app.get('/getallcharacters', (req, res) => {
  People.find({})
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

//localhost:3000/deletepeople?search=PeopleName
app.get('/deletecharacter', (req, res) => {
  People.deleteMany({ name: req.query.search })
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(400).json(error);
    });
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});


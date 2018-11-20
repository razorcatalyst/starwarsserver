const express = require('express');
const app = express();
const axios = require('axios');
const People = require('./People');
//const path = require('path'); //---heroku---
const cors = require('cors');

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

//localhost:5000/getpeople?name=Name
app.get('/getpeople', (req, res) => {
  const name = req.query.name;
  const querystr = `https://swapi.co/api/people/?search=${name}`;

  axios
    .get(querystr)
    .then(response => {
      const people = new People({
        name: response.data.results[0].name,
        height: response.data.results[0].height,
        mass: response.data.results[0].mass,
        gender: response.data.results[0].gender,
        films: response.data.results[0].films,
        species: response.data.results[0].species,
        // image:
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

//localhost:5000/getallpeople
app.get('/getallpeople', (req, res) => {
  People.find({})
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

//localhost:5000/deletemovie?title=MovieTitle
app.get('/deletepeople', (req, res) => {
  People.deleteMany({ name: req.query.name })
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

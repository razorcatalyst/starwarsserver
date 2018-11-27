const mongoose = require('mongoose');
const db = 'mongodb://admin123:admin123@ds163013.mlab.com:63013/webapiassignment';

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Connected to the mLab database');
  })
  .catch(error => {
    console.log('Mongoose connection error: ', error);
  });

const schema = mongoose.Schema({
  name: { type: String },
  height: { type: String },
  mass: { type: String },
  gender: { type: String },
  image: { type: String }
});

const People = mongoose.model('People', schema, 'peopleCollection');

module.exports = People;

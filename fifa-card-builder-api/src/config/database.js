const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/fifa-cards-api';

mongoose.connect(url, { useNewUrlParser: true})

module.exports = mongoose;
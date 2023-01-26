const { default: mongoose } = require('mongoose');
const mongodb = require('mongoose');

const Movie = mongoose.model('movie', {
    img:String
} )

module.exports = Movie
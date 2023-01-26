const { default: mongoose } = require('mongoose');
const mongodb = require('mongoose');

const Movie = mongoose.model('Movie', {
    img:String
} )

module.exports = Movie
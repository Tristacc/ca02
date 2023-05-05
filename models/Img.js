const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var imgSchema = Schema({
    url: String,
    description: String,
    isliked: Boolean
});

module.exports = mongoose.model('Img', imgSchema);
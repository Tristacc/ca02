
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
  username: String,
  passphrase: String,
  age: Number,
  catImgs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Img' }],
});

module.exports = mongoose.model('User', userSchema);

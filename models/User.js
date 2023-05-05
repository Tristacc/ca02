
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
  username: String,
  passphrase: String,
  age: Number,
  catImgs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Img' }],
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Response' }],
});

module.exports = mongoose.model('User', userSchema);

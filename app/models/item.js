var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  price: {type: Number, required: true},
  picture: {type: String},
  _creator: {type: Schema.Types.ObjectId, ref: 'User'}
});

var Item = mongoose.model('Item', itemSchema);

module.exports = Item;

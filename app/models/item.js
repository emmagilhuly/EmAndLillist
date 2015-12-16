var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  price: {type: Number, required: true},
<<<<<<< HEAD
  picture: {type: String},
  user: {type: Schema.Types.ObjectId, ref: 'User'}
=======
  picture: {type: String}
  // user: {type: Schema.Types.ObjectId, ref: 'User'}
>>>>>>> 115556b1201b8a9ae25bb4a4609de183a8a577b2
});

var Item = mongoose.model('Item', itemSchema);

module.exports = Item;

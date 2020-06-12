var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var CoinSchema = new Schema({
  coinid: { type: String, lowercase: true, unique: true, index: true},
  value: { type: Number, default: 0 },
  script: { type: String },
  type: { type: String },
  address: { type: String, index: true},
  height: { type: Number, default: 0},
  spendable: { type: Number, default: 0},
  spendHeight: { type: Number, default: 0 },
}, {id: false});

module.exports = mongoose.model('Coin', CoinSchema);
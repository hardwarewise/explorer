var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var LocationNodesSchema = new Schema({
  location: { type: String, default: "" },
  lil: { type: Number, default: 0 },
  mid: { type: Number, default: 0 },
  big: { type: Number, default: 0 },
});

module.exports = mongoose.model('LocationNodes', LocationNodesSchema);
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var InfinityNodeSchema = new Schema({
  burntx: { type: String, lowercase: true, unique: true, index: true},
  address: { type: String, default: "" },
  start_height: { type: Number, default: 0 },
  expired_height: { type: Number, default: 0 },
  burnvalue: { type: Number, default: 0 },
  type: { type: Number, default: 0 },
  address_backup: { type: String, default: "" },
  last_paid: { type: Number, default: 0 },
  rank: { type: Number, default: 0 },
  publickey: { type: String, default: "" },
  ip: { type: String, default: "" },
  country: { type: String, default: "" }
});

module.exports = mongoose.model('Inf', InfinityNodeSchema);


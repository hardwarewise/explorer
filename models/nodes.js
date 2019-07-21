var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var NodesSchema = new Schema({
  createdAt: { type: Date, expires: 86400, default: Date.now()},
  address: { type: String, default: "" },
  status: { type: String, default: "" },
  protocol: { type: String, default: "" },
  last_seen: { type: String, default: "" },
  active_time: { type: String, default: "" },
  ip: { type: String, default: "" },
  type: { type: String, default: "" },
  reward: { type: String, default: "" },
  burnfund: { type: String, default: "" },
  expire_height: { type: Number, default: 0 },
  country: { type: String, default: "" }
});

module.exports = mongoose.model('Nodes', NodesSchema);

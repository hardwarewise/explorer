var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var IncomeSchema = new Schema({
  coin: { type: String },
  in_burnt_big: { type: Number, default: 0 },
  in_burnt_mid: { type: Number, default: 0 },
  in_burnt_lil: { type: Number, default: 0 },
  in_burnt_address: { type: Number, default: 0 },
  in_burnt_tx: { type: Number, default: 0 },
  payout_miner: { type: Number, default: 0 },
  payout_node_big: { type: Number, default: 0 },
  payout_node_mid: { type: Number, default: 0 },
  payout_node_lil: { type: Number, default: 0 }
});

module.exports = mongoose.model('Income', IncomeSchema);


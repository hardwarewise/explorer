var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
 
var StatsSchema = new Schema({
  coin: { type: String },
  count: { type: Number, default: 1 },
  last: { type: Number, default: 1 },
  //difficulty: { type: Object, default: {} },
  //hashrate: { type: String, default: 'N/A' },
  supply: { type: Number, default: 0 },
  //last_txs: { type: Array, default: [] },
  connections: { type: Number, default: 0 },
  last_price: { type: Number, default: 0 },
  addresses: { type: Number, default: 0 },
  active_addresses: { type: Number, default: 0 },
  top10: { type: Number, default: 0 },
  top50: { type: Number, default: 0 },
  node_burn: { type: Number, default: 0 },
  fee_burn: { type: Number, default: 0 },
  tx_d0_count: { type: Number, default: 0 },
  tx_d0_value: { type: Number, default: 0 },
  tx_d1_count: { type: Number, default: 0 },
  tx_d1_value: { type: Number, default: 0 },
  tx_d2_count: { type: Number, default: 0 },
  tx_d2_value: { type: Number, default: 0 },
  tx_d3_count: { type: Number, default: 0 },
  tx_d3_value: { type: Number, default: 0 },
  tx_d4_count: { type: Number, default: 0 },
  tx_d4_value: { type: Number, default: 0 },
  tx_d5_count: { type: Number, default: 0 },
  tx_d5_value: { type: Number, default: 0 },
  tx_d6_count: { type: Number, default: 0 },
  tx_d6_value: { type: Number, default: 0 },
});

module.exports = mongoose.model('coinstats', StatsSchema);

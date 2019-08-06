var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var PoolsSchema = new Schema({
  createdAt: { type: Date, expires: 86400, default: Date.now()},
  pool_name: { type: String, default: "" },
  homepage: { type: String, default: "" },
  block_height: { type: Number, default: 0 },
  workers: { type: Number, default: 0 },
  blocks_in_24h: { type: Number, default: 0 },
  last_block: { type: Number, default: 0 },
  pool_hashrate: { type: Number, default: 0 }
});

PoolsSchema.index( { createdAt: 1, name: 1 }, { unique: true } );

module.exports = mongoose.model('Pools', PoolsSchema);

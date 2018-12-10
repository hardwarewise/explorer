var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
 
var TermDepositStatsSchema = new Schema({
  term_deposit_wallets: { type: Number, default: 0 },
  term_deposit_txs: { type: Number, default: 0 },
  term_deposit_total: { type: Number, default: 0 },
});

module.exports = mongoose.model('termdepositstats', TermDepositStatsSchema);
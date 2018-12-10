var mongoose = require('mongoose')
  , lib = require('../lib/explorer')
  , db = require('../lib/database')
  , TermDepositStats = require('../models/termdepositstats')
  , settings = require('../lib/settings')
  , request = require('request');

var COUNT = 5000; //number of blocks to index

function exit() {
  mongoose.disconnect();
  process.exit(0);
}

var dbString = 'mongodb://' + settings.dbsettings.user;
dbString = dbString + ':' + settings.dbsettings.password;
dbString = dbString + '@' + settings.dbsettings.address;
dbString = dbString + ':' + settings.dbsettings.port;
dbString = dbString + '/' + settings.dbsettings.database;

mongoose.connect(dbString, function(err) {
  if (err) {
    console.log('Unable to connect to database: %s', dbString);
    console.log('Aborting');
    exit();
  } else {
		request({uri: 'http://127.0.0.1:' + settings.port + '/api/gettermdepositstats', json: true}, function (error, response, body) {
			console.log(JSON.stringify(body));
			if ( typeof(body) !== "undefined" ){
					db.create_termdepositstats({
					term_deposit_wallets: body.nAddress,
					term_deposit_txs: body.nTimeLockedTxs,
					term_deposit_total: body.nTotalTimeLockedValue
					}, function(){
						db.get_stats(settings.coin, function(nstats){
							console.log('reindex complete (block: %s)', nstats.last);
							exit();
						});
					});
			}else{
				console.log('Error: call API error. Make sur that Explorer server is online.');
				exit();
			}
		});
  }
});

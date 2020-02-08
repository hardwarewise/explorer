var mongoose = require('mongoose')
  , jsonminify = require("jsonminify")
  , lib = require('../lib/explorer')
  , db = require('../lib/database')
  , Tx = require('../models/tx')
  , Pools = require('../models/pools')
  , Address = require('../models/address')  
  , Richlist = require('../models/richlist')  
  , Stats = require('../models/stats')  
  , settings = require('../lib/settings')
  , fs = require('fs');


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
    const data = [];
	for(const pool in settings.pools) {
		var poollistFilename = settings.pools[pool].pool_name + ".json";
		//poollistFilename = "./" + poollistFilename;
		poollistFilename = "./cache/" + poollistFilename;

		var poolliststatsStr;
		try{
			//read the settings sync
			poolliststatsStr = fs.readFileSync(poollistFilename).toString();
		} catch(e){
			console.log(poollistFilename);
			console.warn('No stats file found. Continuing using defaults!');
			continue;
		}

		var poolliststats = {"":""};
		try {
			if(poolliststatsStr) {
				poolliststatsStr = jsonminify(poolliststatsStr).replace(",]","]").replace(",}","}");
				poolliststats = JSON.parse(poolliststatsStr);
				data.push({
					createdAt: Date.now(),
					pool_name: settings.pools[pool].pool_name,
					homepage: settings.pools[pool].homepage,
					block_height: poolliststats.SIN['height'],
					workers: poolliststats.SIN['workers'],
					blocks_in_24h: poolliststats.SIN['24h_blocks'],
					last_block: poolliststats.SIN['lastblock'],
					pool_hashrate: poolliststats.SIN['hashrate']
				});
			}else{
				data.push({
					poolliststats
				});
			}
		}catch(e){
			data.push({
					poolliststats
			});
		}
	}

	lib.syncLoop(data.length, function (loop) {
          var i = loop.iteration();
          var pool = data[i];
          Pools.countDocuments({pool_name: pool.pool_name}).exec(function(err, count){
            console.log("Pool exist: "+ count);
            if (count ==0){
		console.log("Create pool: " + JSON.stringify(pool));
		db.create_pool({
				createdAt: pool.createdAt,
				pool_name: pool.pool_name,
				homepage: pool.homepage,
				block_height: pool.block_height,
				workers: pool.workers,
				blocks_in_24h: pool.blocks_in_24h,
				last_block: pool.last_block,
				pool_hashrate: pool.pool_hashrate
			}, function(){
			loop.next();
		});
             } else {
                console.log("Update pool: " + JSON.stringify(pool));
                if (pool.pool_hashrate > 0){
                  Pools.updateOne({pool_name: pool.pool_name}, {
                                homepage: pool.homepage,
                                block_height: pool.block_height,
                                workers: pool.workers,
                                blocks_in_24h: pool.blocks_in_24h,
                                last_block: pool.last_block,
                                pool_hashrate: pool.pool_hashrate
                  }, function() {loop.next();});
                } else {
                  loop.next();
                }
            }
          });
	}, function() {
        exit();
    });
  }
});

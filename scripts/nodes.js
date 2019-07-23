var mongoose = require('mongoose')
  , lib = require('../lib/explorer')
  , db = require('../lib/database')
  , Tx = require('../models/tx')
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
    request({uri: 'http://127.0.0.1:' + settings.port + '/nodelist', json: true}, function (error, response, body) {
      const keys = Object.keys(body);
      lib.syncLoop(keys.length, function (loop) {
        var i = loop.iteration();
        var address = keys[i];
        db.find_node(address, function(node) {
          if (node) {
            // node already exists
            loop.next();
          } else {
             const lineData = body[keys[i]].split(" ");
                const noEmptyData = [];
                for (var j = 0; j < lineData.length; j++) {
                  if (lineData[j].length !== 0) {
                    noEmptyData.push(lineData[j])
                  }
                }
             var ip = noEmptyData[7].split(':')[0];
             var burnTx = noEmptyData[11].split('-')[0];
             var burnTxIndex = noEmptyData[11].split('-')[1];
             request({uri: 'https://api.ipgeolocation.io/ipgeo?apiKey=04515697f2ad44ddb42916c824f6261f&ip=' + ip, json: true}, function (error, response, geo) {
              db.get_tx(burnTx, function(tx) {
                if (tx) {
                  console.log("Add node: " + burnTx);
                  db.create_node({
                    address: address,
                    status: noEmptyData[0].replace(/_/g, ' ').toLowerCase(),
                    protocol: noEmptyData[1],
                    last_seen: noEmptyData[3],
                    active_time: noEmptyData[4],
                    ip: ip,
                    type: noEmptyData[8],
                    reward: noEmptyData[9],
                    burnfund: noEmptyData[10],
                    expire_height: tx.blockindex + 720 * 365,
                    country: geo.country_code2
                  }, function(){
                    loop.next();
                  });
                }else{
                  console.log("Not found:" + burnTx);
                  loop.next();
                }
              });
            });
          }
        });
      }, function() {
        exit();
      });
    });
  }
});


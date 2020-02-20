var mongoose = require('mongoose')
  , lib = require('../lib/explorer')
  , db = require('../lib/database')
  , Tx = require('../models/tx')
  , Nodes = require('../models/nodes')
  , Inf = require('../models/infnodes')
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
    request({uri: 'http://127.0.0.1:' + settings.port + '/api/masternodelist?param=info', json: true}, function (error, response, body) {
      if(error){console.log('Error when get list of node'); exit();}
      Nodes.remove().exec();
      const keys = Object.keys(body);
      lib.syncLoop(keys.length, function (loop) {
        var i = loop.iteration();
        var address = keys[i];
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

        db.find_infnode(noEmptyData[11], function(infnode){
          if (infnode){
            var infnode_ip = infnode.ip.split(':')[0];
            if(infnode_ip != ip && infnode_ip == "0.0.0.0"){
              console.log("Update ip from masternode " + infnode_ip);
              Inf.updateOne({burntx: noEmptyData[11]}, {
                      ip: ip
                    }, function(){ loop.next(); });
            } else {
              console.log("Nothing to update");
              loop.next();
            }
          }else{
            console.log("Not found node: " , noEmptyData[11]);
            loop.next();
          }
        });
      }, function() {
        exit();
      });
    });
  }
});


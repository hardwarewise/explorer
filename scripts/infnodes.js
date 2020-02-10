var mongoose = require('mongoose')
  , lib = require('../lib/explorer')
  , db = require('../lib/database')
  , Tx = require('../models/tx')
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
    lib.get_infinitynode(function(infnodes){
      const keys = Object.keys(infnodes);
      lib.syncLoop(keys.length, function (loop) {
        var i = loop.iteration();
        var burntx = keys[i];
        const lineData = infnodes[keys[i]].split(" ");
        const noEmptyData = [];
        for (var j = 0; j < lineData.length; j++) {
          if (lineData[j].length !== 0) {
            noEmptyData.push(lineData[j]);
          }
       }


        db.find_infnode(burntx, function(node) {
          if(node){
            // node already exists => check update
            console.log("Existe: " + burntx);
            if (node.last_stm_size != noEmptyData[8] || node.last_paid != noEmptyData[6])
            {
              console.log("Update last paid or last statement size");
              Inf.updateOne({burntx: burntx}, {
                                last_paid: noEmptyData[6],
                                last_stm_size: noEmptyData[8],
                  }, function() {loop.next();});

            } else {
              console.log("Nothing to update");
              loop.next();
            }
          } else {
            // node does not exist => create new node
            console.log("Add " + burntx); 
            db.create_infnode({
              burntx: burntx,
              address: noEmptyData[0],
              start_height: noEmptyData[1],
              expired_height: noEmptyData[2],
              burnvalue: noEmptyData[3],
              type: noEmptyData[4],
              address_backup: noEmptyData[5],
              last_paid: noEmptyData[6],
              rank: noEmptyData[7],
              last_stm_size: noEmptyData[8],
            }, function(){
              loop.next();
            });
          }
        });
      }, function() {
        exit();
      });
    });
  }
});


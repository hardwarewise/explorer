var mongoose = require('mongoose')
  , lib = require('../lib/explorer')
  , db = require('../lib/database')
  , settings = require('../lib/settings')
  , Inf = require('../models/infnodes')
  , request = require('request');

mongoose.set('useCreateIndex', true);

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

mongoose.connect(dbString,{ useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
  if (err) {
    console.log('Unable to connect to database: %s', dbString);
    console.log('Aborting');
    exit();
  } else {
    request({uri: 'http://127.0.0.1:' + settings.port + '/ext/nodelist', json: true}, function (error, response, body) {
      if(error){console.log('Error when get list of node'); exit();}
      lib.syncLoop(body.data.length, function (loop) {
        var i = loop.iteration();
        var ip = body.data[i].ip;
        if (body.data[i].country == "" && ip != "0.0.0.0"){
          request({uri: 'https://freegeoip.live/json/' + ip, json: true}, function (error, response, geo) {
            Inf.updateOne({burntx: body.data[i].burntx}, {
                  country: geo.country_code
                }, function() {
                  console.log("Updated " + ip + " " + geo.country_code);
                  loop.next();
                });
          });
        }else{
          console.log("Nothing to update.");
          loop.next();
        }
      }, function() {
        exit();
      });
    });
  }
});

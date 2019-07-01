var mongoose = require('mongoose')
  , lib = require('../lib/explorer')
  , db = require('../lib/database')
  , settings = require('../lib/settings')
  , LocationNodes = require('../models/locationnodes')
  , Nodes = require('../models/nodes')
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
    const cursor = Nodes.aggregate([
                     {
                       $group: {
                         _id: {country: "$country", type: "$type"},
                         count: { $sum: 1 }
                       }
                     }
                  ]).cursor({ batchSize: 1000}).exec();
    const result = async function () {
        const data = [];
        var doc;
        while ((doc = await cursor.next())) {
          if (doc) {
            var exist = 0;
            for (var i = 0; i < data.length; i++) {
              if (data[i]['location'] == doc['_id'].country) {
                if (doc['_id'].type == "1") {
                  data[i]['lil'] = doc['count'];
                }
                if (doc['_id'].type == "5") {
                  data[i]['mid'] = doc['count'];
                }
                if (doc['_id'].type == "10") {
                  data[i]['big'] = doc['count'];
                }
              } else {
                exist++;
              }
            }
            //don't exist
            if (exist == data.length) {
              var item = {location: doc['_id'].country, lil: 0, mid: 0, big: 0}
                if (doc['_id'].type == "1") {
                  item['lil'] = doc['count'];
                }
                if (doc['_id'].type == "5") {
                  item['mid'] = doc['count'];
                }
                if (doc['_id'].type == "10") {
                  item['big'] = doc['count'];
                }
              data.push(item);
            }
          }
        }
        //console.log(data);
        const keys = Object.keys(data);
        lib.syncLoop(keys.length, function (loop) {
          var i = loop.iteration();
          var locationInput = data[i];
          db.find_locationnode(locationInput.location, function(location) {
                console.log(locationInput);
                if(location) {
                  //location exist
                  db.update_locationnode({
                      location: locationInput.location,
                      lil: locationInput.lil,
                      mid: locationInput.mid,
                      big: locationInput.big,
                    }, function(){
                      loop.next();
                    }
                  );
                } else {
                  db.create_locationnode({
                      location: locationInput.location,
                      lil: locationInput.lil,
                      mid: locationInput.mid,
                      big: locationInput.big,
                    }, function(){
                      loop.next();
                    }
                  );
                }
          });
        }, function() {
        exit();
      });
    };
    result();
  }
});

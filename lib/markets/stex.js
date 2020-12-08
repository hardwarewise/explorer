var request = require('request');

var base_url = 'https://api3.stex.com/public';

function get_summary(coin, exchange, cb) {
  var req_url = base_url + '/ticker/811';
  request({uri: req_url, json: true}, function (error, response, body) {
    if (error) {
      return cb(error, null);
    } else {
      if (body.message) {
        return cb(body.message, null)
      } else {
        return cb (null, body.data);
      }
    }
  });
}

function get_trades(coin, exchange, cb) {
  var req_url = base_url + '/trades/811';
  request({uri: req_url, json: true}, function (error, response, body) {
      var history = [];
          for (var i=0; i<body.data.length; i++){
            var temp = {};
            var tdate = new Date(parseInt(body.data[i].timestamp)*1000);
                temp.date = tdate;
                temp.type = body.data[i].type.toLowerCase();
                temp.price = body.data[i].price;
                temp.quantity = body.data[i].amount;
                history.push(temp);
          }
      return cb (null, history);
  });
}

function get_orders(coin, exchange, cb) {
  var req_url = base_url + '/orderbook/811';
  request({uri: req_url, json: true}, function (error, response, body) {
     var orders = body;
     var buys = [];
     var sells = [];
     if (Object.keys(orders.data.bid).length > 0){
       for (var i =0; i < orders.data.bid.length; i++) {
         var orderbuy = orders.data.bid[i];
         var order = {
           amount: parseFloat(orderbuy.amount).toFixed(8),
           price: parseFloat(orderbuy.price).toFixed(8),
           total: (parseFloat(orderbuy.amount) * parseFloat(orderbuy.price)).toFixed(8)
         }
         buys.push(order);
       }
     }
     if (Object.keys(orders.data.ask).length > 0){
       for (var i =0; i < orders.data.ask.length; i++) {
         var ordersell = orders.data.ask[i];
         var order = {
           amount: parseFloat(ordersell.amount).toFixed(8),
           price: parseFloat(ordersell.price).toFixed(8),
           total: (parseFloat(ordersell.amount) * parseFloat(ordersell.price)).toFixed(8)
         }
         sells.push(order);
       }
     }
     return cb(null, buys, sells);
  });
}


module.exports = {
  get_data: function(coin, exchange, cb) {
    var error = null;
    get_orders(coin, exchange, function(err, buys, sells) {
      if (err) { error = err; }
      get_trades(coin, exchange, function(err, trades) {
        if (err) { error = err; }
        get_summary(coin, exchange, function(err, stats) {
          if (err) { error = err; }
          return cb(error, {buys: buys, sells: sells, chartdata: [], trades: trades, stats: stats});
                  });
      });
    });
  }
};


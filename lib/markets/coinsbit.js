var request = require('request');

var base_url = 'http://coinsbit.io/api/v1/public';

function get_summary(coin, exchange, cb) {
  var req_url = base_url + '/ticker?market=SIN_BTC';
  request({uri: req_url, json: true}, function (error, response, body) {
    if (error) {
      return cb(error, null);
    } else {
      if (body.message) {
        return cb(body.message, null)
      } else {
        return cb (null, body.result);
      }
    }
  });
}

function get_trades(coin, exchange, cb) {
  var req_url = base_url + '/history?market=SIN_BTC&lastId=1';
  request({uri: req_url, json: true}, function (error, response, body) {
      var history = [];
          for (var i=0; i<body.result.length; i++){
            var temp = {};
                temp.date = body.result[i].time;
                temp.type = body.result[i].type;
                temp.price = body.result[i].price;
                temp.quantity = body.result[i].amount;
                history.push(temp);
          }
      return cb (null, history);
  });
}

function get_orders(coin, exchange, cb) {
  var req_url = base_url + '/book?market=SIN_BTC&side=buy';
  request({uri: req_url, json: true}, function (error, response, body) {
     var orders_buy = body.result.orders;
     var req_url_sell = base_url + '/book?market=SIN_BTC&side=sell';
     request({uri: req_url_sell, json: true}, function (error, response, body) {
       var orders_sell = body.result.orders;
       var buys = [];
       var sells = [];
       if (Object.keys(orders_buy).length > 0){
         for (var i =0; i < orders_buy.length; i++) {
           var orderbuy = orders_buy[i];
           var order = {
             amount: parseFloat(orderbuy.left).toFixed(8),
             price: parseFloat(orderbuy.price).toFixed(8),
             total: (parseFloat(orderbuy.left) * parseFloat(orderbuy.price)).toFixed(8)
           }
           buys.push(order);
         }
       }
       if (Object.keys(orders_sell).length > 0){
           for (var i =0; i < orders_sell.length; i++) {
             var ordersell = orders_sell[i];
             var order = {
               amount: parseFloat(ordersell.left).toFixed(8),
               price: parseFloat(ordersell.price).toFixed(8),
               total: (parseFloat(ordersell.left) * parseFloat(ordersell.price)).toFixed(8)
             }
             sells.push(order);
           }
       }
       return cb(null, buys, sells);
     });
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


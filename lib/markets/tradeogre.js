var request = require('request');

var base_url = 'https://tradeogre.com/api/v1';

function get_summary(coin, exchange, cb) {
  var req_url = base_url + '/ticker/' + exchange + '-' + coin;
  request({uri: req_url, json: true}, function (error, response, body) {
    if (error) {
      return cb(error, null);
    } else {
      if (body.message) {
        return cb(body.message, null)
      } else {
        body['last'] = body['price'];
        return cb (null, body);
      }
    }
  });
}

function get_trades(coin, exchange, cb) {
  var req_url = base_url + '/history/' + exchange + '-' + coin;
  request({uri: req_url, json: true}, function (error, response, body) {
      return cb (null, body.reverse());
  });
}

function get_orders(coin, exchange, cb) {
  var req_url = base_url + '/orders/'  + exchange + '-' + coin;
  request({uri: req_url, json: true}, function (error, response, body) {
    if (body.success == "true") {
      var orders = body;
      var buys = [];
      var sells = [];
      if (Object.keys(orders['buy']).length > 0){
          for (x in orders['buy']) {
            var order = {
              amount: parseFloat(orders['buy'][x]).toFixed(8),
              price: parseFloat(x).toFixed(8),
              //  total: parseFloat(orders.buy[i].Total).toFixed(8)
              // Necessary because API will return 0.00 for small volume transactions
              total: (parseFloat(x) * parseFloat(orders['buy'][x])).toFixed(8)
            }
            buys.push(order);
          }
      }
      if (Object.keys(orders['sell']).length > 0) {
        for (x in orders['sell']) {
            var order = {
                amount: parseFloat(orders['sell'][x]).toFixed(8),
                price: parseFloat(x).toFixed(8),
                //    total: parseFloat(orders.sell[x].Total).toFixed(8)
                // Necessary because API will return 0.00 for small volume transactions
                total: (parseFloat(orders['sell'][x]) * parseFloat(x)).toFixed(8)
            }
            sells.push(order);
        }
      }
      return cb(null, buys.reverse(), sells);
    } else {
      return cb(body.message, [], []);
    }
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
var request = require('request');

var base_url = 'https://api.crex24.com/v2/public';

function get_summary(coin, exchange, cb) {
  var req_url = base_url + '/tickers?instrument=' + coin + '-' + exchange;
  request({uri: req_url, json: true}, function (error, response, body) {
    if (error) {
      return cb(error, null);
    } else {
      if (body.message) {
        return cb(body.message, null)
      } else {
        console.log(JSON.stringify(response));
        return cb (null, body[0]);
      }
    }
  });
}

function get_trades(coin, exchange, cb) {
  var req_url = base_url + '/recentTrades?instrument=' + coin + '-' + exchange;
  request({uri: req_url, json: true}, function (error, response, body) {
      var history = [];
	  for (var i=0; i<body.length; i++){
	    var temp = {};
		temp.date = body[i].timestamp;
		temp.type = body[i].side;
		temp.price = body[i].price;
		temp.quantity = body[i].volume;
		history.push(temp);
	  }
      return cb (null, history);
  });
}

function get_orders(coin, exchange, cb) {
  var req_url = base_url + '/orderBook?instrument=' + coin + '-' + exchange;
  request({uri: req_url, json: true}, function (error, response, body) {
      var orders = body;
      var buys = [];
      var sells = [];
      if (Object.keys(orders.buyLevels).length > 0){
        for (var i =0; i < orders.buyLevels.length; i++) {
	    var orderbuy = orders.buyLevels[i];
            var order = {
              amount: parseFloat(orderbuy.volume).toFixed(8),
              price: parseFloat(orderbuy.price).toFixed(8),
              total: (parseFloat(orderbuy.volume) * parseFloat(orderbuy.price)).toFixed(8)
            }
            buys.push(order);
        }
      }
      if (Object.keys(orders.sellLevels).length > 0) {
        for (var i =0; i < orders.sellLevels.length; i++) {
	    var ordersell = orders.sellLevels[i];
            var order = {
                amount: parseFloat(ordersell.volume).toFixed(8),
                price: parseFloat(ordersell.price).toFixed(8),
                total: (parseFloat(ordersell.volume) * parseFloat(ordersell.price)).toFixed(8)
            }
            sells.push(order);
        }
      }
      return cb(null, buys, sells);
  });
}

function get_chartdata(coin, exchange, cb) {
  var end = Date.now();
  start = end - 86400;
  var req_url = base_url + '/ohlcv?instrument=' + coin + '-' + exchange + '&granularity=4h&limit=28';
  request({uri: req_url, json: true}, function (error, response, chartdata) {
    if (error) {
      return cb(error, []);
    } else {
      if (chartdata.Error == null) {
        var processed = [];
        for (var i = 0; i < chartdata.length; i++) {
          processed.push([ Date.parse(chartdata[i].timestamp), parseFloat(chartdata[i].open),
		  parseFloat(chartdata[i].high), parseFloat(chartdata[i].low), parseFloat(chartdata[i].close)]);
          if (i == chartdata.length - 1) {
            return cb(null, processed);
          }
        }
      } else {
        return cb(chartdata.error, []);
      }
    }
  });
}

module.exports = {
  get_data: function(coin, exchange, cb) {
    var error = null;
    get_chartdata(coin, exchange, function (err, chartdata){
		if (err) {
			chartdata = [];
			error = err;
        }
		get_orders(coin, exchange, function(err, buys, sells) {
		  if (err) { error = err; }
		  get_trades(coin, exchange, function(err, trades) {
			if (err) { error = err; }
			get_summary(coin, exchange, function(err, stats) {
			  if (err) { error = err; }
			  return cb(error, {buys: buys, sells: sells, chartdata: chartdata, trades: trades, stats: stats});
			});
		  });
		});
	});
  }
};



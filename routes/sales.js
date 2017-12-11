var express = require('express');
var mongoose = require('mongoose');
var async = require('async');

var Sale = require('../models/sales');
var MerchantSale = require('../models/merchantSales');
var MerchantClient = require('../models/merchantClients');
var Ticket = require('../models/tickets');

var router = express.Router();

// MERCHANT SALES
router.post('/my-sales', function(req, res, next) {

  // FORMAT FROM DATE
  let fromDate = req.body.fromDate + ' 00:00:00';

  // FORMAT TO DATE
  let toDate = new Date(req.body.toDate);
  toDate.setDate(toDate.getDate() + 1);
  let toDateFormated = toDate.getFullYear() + '-' + (toDate.getMonth() + 1) + '-' + toDate.getDate() + ' 00:00:00';

  // GET SALES
  var myTickets = Ticket.schema.methods.getTickets('5990895d94c8cd56cee5c941', fromDate, toDateFormated);
  myTickets.then(function(merchantTickets) {

    var json = JSON.stringify(merchantTickets);
    res.end(json);

  }, function(err){
    // handle error
    res.end(err);
  });

});

// NEW SALE
router.post('/add-sale', function(req, res, next) {

  // SOCKET INSTANCE
  var io = req.app.get('socketio');

  var userId = '59f9115f12968eb133d3642a';
  var merchantId = '5990895d94c8cd56cee5c941';
  var storeId = '59bd3ea4c2077919a442c3f0';

  var saleProccess = true;
  var totalAmount = 0;
  var itemsId = [];

  var items = [{
    productId : '59c935256fa6e494b1ae6f10',
    merchantProductId : '59c936823c9c57956368f065',
    lotId : '59c045b52ec64b07174668d9',
    acqPrice : 0.35,
    price : 1,
    units : 3
  },
  {
    productId : '59c935256fa6e494b1ae6f16',
    merchantProductId : '59ca6d5d2ed42ed759486c58',
    lotId : '59ca6d5d2ed42ed759486c57',
    acqPrice : 0.35,
    price : 1,
    units : 1
  }];

  for(let i = 0; i < items.length; i++) {

    // RANDOM SALE ID FOR THE TICKET
    var saleId = mongoose.Types.ObjectId();
    totalAmount += ( items[i].price * items[i].units );
    itemsId.push(saleId);

    // NEW SALE
    var newSale = Sale.schema.methods.newSale(saleId, items[i].productId, items[i].merchantProductId, items[i].lotId, items[i].acqPrice, items[i].price, items[i].units);
    newSale.then(function() {
      
    }, function(err) {

      saleProccess = false;

      // ERASE PREVIOUS SALES
      
      // RESPONSE SALE PROCCESS FAILED
      io.emit('newSale', false);
      res.end(false);

    });

  }

  if(saleProccess == true) {

    // NEW TICKET
    var newTicket = Ticket.schema.methods.newTicket(userId, itemsId, merchantId, storeId, totalAmount);
    newTicket.then(function() {

      return MerchantClient.schema.methods.checkMerchantClient(userId);

    }, function(err) {
      // want to handle errors here
    }).then(function(user) {

      if(user) {

        // SOCKET EMIT WHEN SALE DONE
        io.emit('newSale', true);
        res.end();

        return Promise.reject();

      } else {

        return MerchantClient.schema.methods.newMerchantClient(merchantId, storeId, userId);

      }

    }, function(err) {
      // want to handle errors here
    }).then(function() {

      // SOCKET EMIT WHEN SALE DONE
      io.emit('newSale', true);
      res.end();

    }, function(err) {
      // want to handle errors here
    });

  }

});

module.exports = router;

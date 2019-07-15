var express = require('express');
var mongoose = require('mongoose');
var checkAuth = require('../middleware/check.auth');
var async = require('async');

var Sale = require('../models/sales');
var MerchantSale = require('../models/merchantSales');
var MerchantClient = require('../models/merchantClients');
var Ticket = require('../models/tickets');

var router = express.Router();

// MERCHANT SALES
router.post('/my-sales', checkAuth, function(req, res, next) {

  // FORMAT FROM DATE
  let fromDate = req.body.fromDate + ' 00:00:00';

  // FORMAT TO DATE
  let toDate = new Date(req.body.toDate);
  toDate.setDate(toDate.getDate() + 1);
  let toDateFormated = toDate.getFullYear() + '-' + (toDate.getMonth() + 1) + '-' + toDate.getDate() + ' 00:00:00';

  // GET SALES
  var myTickets = Ticket.schema.methods.getTickets(req.body.merchantId);
  myTickets.then(merchantTickets => {

    var tickets = [];

    for(let i = 0; i < merchantTickets.length; i++) {

      var total = 0;
      var profit = 0;
      var quantity = 0;
      var saleDate = new Date(merchantTickets[i].date);
      var ticketRate = 0;

      for(var j = 0; j < merchantTickets[i].saleId.length; j++) {
        quantity += merchantTickets[i].saleId[j].units;
        total += (merchantTickets[i].saleId[j].price * merchantTickets[i].saleId[j].units);
        profit += (merchantTickets[i].saleId[j].price - merchantTickets[i].saleId[j].acqPrice) * merchantTickets[i].saleId[j].units;
        ticketRate += merchantTickets[i].saleId[j].rate;
      }

      ticketRate = parseInt((ticketRate / merchantTickets[i].saleId.length).toFixed(0));

      tickets.push({
        date: `${saleDate.getDate()}/${saleDate.getMonth() + 1}/${saleDate.getFullYear()}`,
        time: `${saleDate.getHours()}:${saleDate.getMinutes()}`,
        profit: profit.toFixed(2),
        quantity: quantity,
        total: total,
        rate: ticketRate,
        merchantId: merchantTickets[i].merchantId,
        method: merchantTickets[i].method,
        saleId: merchantTickets[i].saleId,
        storeId: merchantTickets[i].storeId,
        totalAmount: merchantTickets[i].totalAmount,
        userId: merchantTickets[i].userId._id,
        genre: merchantTickets[i].userId.genre,
        user: `${merchantTickets[i].userId.name} ${merchantTickets[i].userId.lastName}`,
        _id: merchantTickets[i]._id,
      });

    }

    // RETURN MERCHANT INFO
    res.status(200).json({
      response: {
          code: 200,
          message: 'Merchant tickets found',
          status: '',
      },
      result: tickets,
    });

  }).catch(err => {

    // HANDLE ERROR
    res.status(err.statusCode || 500).json(err);

  });
});

// GET TICKET DETAIL
router.get('/ticket-details/:ticketId', checkAuth, function(req, res, next) {

  var ticketDetails = Ticket.schema.methods.getTicket(req.params.ticketId);
  ticketDetails.then(ticketDetails => {

    // RETURN MERCHANT INFO
    res.status(200).json({
      response: {
          code: 200,
          message: 'Ticket details found',
          status: '',
      },
      result: ticketDetails,
    });

  }).catch(err => {

    // HANDLE ERROR
    res.status(err.statusCode || 500).json(err);

  });

});

// GET USER TICKETS
router.get('/', checkAuth, function(req, res, next) {

  var userTickets = Ticket.schema.methods.getClientTickets(req.query.userId, req.query.merchantId);
  userTickets.then(userTickets => {

    // RETURN MERCHANT INFO
    res.status(200).json({
      response: {
          code: 200,
          message: 'User tickets found',
          status: '',
      },
      result: userTickets,
    });

  }).catch(err => {

    

    // HANDLE ERROR
    res.status(err.statusCode || 500).json(err);

  });

});

// NEW SALE
router.get('/new-sale', function(req, res, next) {

  // SOCKET INSTANCE
  var io = req.app.get('socketio');

  var userId = '59f9115f12968eb133d3642a';
  var merchantId = '5b6b205b5d3a3e7a7cdbb51d';
  var storeId = '59bd3ea4c2077919a442c3f0';

  var saleProccess = true;
  var totalAmount = 0;
  var itemsId = [];

  var items = [{
    productId : '59c935256fa6e494b1ae6f16',
    merchantProductId : '59ca6d5d2ed42ed759486c58',
    lotId : '59ca6d5d2ed42ed759486c57',
    acqPrice : 0.35,
    price : 1,
    units : 3
  }];

  for(let i = 0; i < items.length; i++) {

    // RANDOM SALE ID FOR THE TICKET
    var saleId = mongoose.Types.ObjectId();
    totalAmount += ( items[i].price * items[i].units );
    itemsId.push(saleId);

    // NEW SALE
    var newSale = Sale.schema.methods.newSale(saleId, items[i].productId, items[i].merchantProductId, items[i].lotId, items[i].acqPrice, items[i].price, items[i].units);
    newSale.then(newSale => {
    
    }).catch(err => {

      saleProccess = false;

      // ERASE PREVIOUS SALES
      
      // RESPONSE SALE PROCCESS FAILED
      io.emit('newSale', false);
      
      // HANDLE ERROR
      es.status(err.statusCode || 500).json(err);

    });

  }

  if(saleProccess == true) {

    // NEW TICKET
    var newTicket = Ticket.schema.methods.newTicket(userId, itemsId, merchantId, storeId, totalAmount);
    newTicket.then(ticket => {

      return MerchantClient.schema.methods.checkMerchantClient(userId);

    }).catch(err => {

      console.log(err);

    }).then(user => {

      if(user) {

        // SOCKET EMIT WHEN SALE DONE
        //io.emit('newSale', true);
        res.end();

        return Promise.reject();

      } else {

        return MerchantClient.schema.methods.newMerchantClient(merchantId, storeId, userId);

      }

    }).catch(err => {
      // want to handle errors here
    }).then(() => {

      // SOCKET EMIT WHEN SALE DONE
      //io.emit('newSale', true);
      res.end();

    }).catch(err => {

      console.log(err);
      // want to handle errors here
    });

  }

});

module.exports = router;

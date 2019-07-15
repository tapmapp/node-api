var mongoose = require('mongoose');

var Merchant = require('./merchants');
var Sale = require('./sales');
var Store = require('./stores');
var User = require('./users');

var ticketSchema = new mongoose.Schema({
  merchantId: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true },
  saleId: { type: [ mongoose.Schema.Types.ObjectId ], ref: "Sale", required: true },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  totalAmount: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  method: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true }
});

var Ticket = mongoose.model('Ticket', ticketSchema);

// GET MERCHANT TICKETS
ticketSchema.methods.getTickets = function (merchantId) {

  return Ticket.find().where({ 
    merchantId: merchantId, 
    /*
    date: {
      $gte: new Date(fromDate),
      $lt: new Date(toDate)
    }*/
  }).populate({
    path:'saleId',
    model:'Sale',
    populate: [{
      path: 'merchantProductId',
      model: 'MerchantProduct',
      populate: {
        path: 'category',
        model: 'Category'
      }
    },
    {
      path: 'productId',
      model: 'Product'
    }]
  }).populate({
    path:'storeId',
    model:'Store'
  }).populate({
    path:'userId',
    model:'User',
  }).sort({date:-1});

}

// GET CLIENT TICKETS
ticketSchema.methods.getClientTickets = function (userId, merchantId) {

  return Ticket.find().where({ 
    merchantId: merchantId, 
    userId: userId,
  }).populate({
    path:'saleId',
    model:'Sale',
    populate: [{
      path: 'merchantProductId',
      model: 'MerchantProduct',
      populate: {
        path: 'category',
        model: 'Category'
      }
    },
    {
      path: 'productId',
      model: 'Product'
    }]
  }).populate({
    path:'storeId',
    model:'Store'
  }).sort({date:-1});

}

// GET TICKET BY ID
ticketSchema.methods.getTicket = function (ticketId) {

  return Ticket.findOne({ 
    _id: ticketId,
  }).populate({
    path:'saleId',
    model:'Sale',
    populate: [{
      path: 'merchantProductId',
      model: 'MerchantProduct',
      populate: {
        path: 'category',
        model: 'Category'
      }
    },
    {
      path: 'productId',
      model: 'Product'
    }]
  }).populate({
    path:'storeId',
    model:'Store'
  }).populate({
    path:'userId',
    model:'User',
  }).exec();

}

ticketSchema.methods.newTicket = function (userId, saleId, merchantId, storeId, totalAmount) {

  var ticket = new Ticket({
    merchantId: merchantId,
    saleId: saleId,
    storeId: storeId,
    totalAmount: totalAmount,
    userId: userId,
    method: 'cash',
  });

  return ticket.save();

}

module.exports = Ticket;
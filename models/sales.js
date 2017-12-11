var mongoose = require('mongoose');

var Lot = require('./lots');
var Product = require('./products');
var Store = require('./stores');
var Merchant = require('./merchants');
var MerchantProduct = require('./merchantProducts');
var MerchantSales = require('./merchantSales');
var User = require('./users');

var saleSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  merchantProductId: { type: mongoose.Schema.Types.ObjectId, ref: "MerchantProduct", required: true },
  lotId: { type: mongoose.Schema.Types.ObjectId, ref: "Lot", required: true },
  acqPrice: { type: Number, required: true },
  price: { type: Number, required: true },
  units: { type: Number, required: true },
  rate: { type: Number, required: true, default: 0 }
});

var Sale = mongoose.model('Sale', saleSchema);

saleSchema.methods.getSales = function (merchandId, fromDate, toDate) {

  return Sale.find().where({ 
    merchantId: merchandId, 
    date: {
      $gte: new Date(fromDate),
      $lt: new Date(toDate)
    }
  //'storeId': ['59bd3ea4c2077919a442c3f0', '59bd3ebbc71a7119b2a9821d']
  }).populate({
      path:'productId',
      model:'Product'
  }).populate({
      path:'merchantProductId',
      model:'MerchantProduct',
      populate: {
        path: 'category',
        model: 'Category'
      }
  });

}

saleSchema.methods.newSale = function (saleId, productId, merchantProductId, lotId, acqPrice, price, units) {

  var sale = new Sale({
    _id: saleId,
    productId: productId,
    merchantProductId: merchantProductId,
    lotId: lotId,
    acqPrice: acqPrice,
    price: price,
    units: units
  });

  return sale.save();

}

module.exports = Sale;
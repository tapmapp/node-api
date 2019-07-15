var mongoose = require('mongoose');

var Category = require('./categories');
var Lot = require('./lots');
var Merchant = require('./merchants');
var Product = require('./products');
var Store = require('./stores');

var merchantProductSchema = new mongoose.Schema({
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  lot: { type: [ mongoose.Schema.Types.ObjectId ], ref: "Lot", required: true }, 
  stores: { type: [ mongoose.Schema.Types.ObjectId ], ref: "Store", required: true }, 
});

var MerchantProduct = mongoose.model('MerchantProduct', merchantProductSchema);

// NEW MERCHANT SALE METHOD
merchantProductSchema.methods.addMerchantProduct = function (merchantId, productId, categoryId, lotId, stores) {

  var merchantProduct = new MerchantProduct({
    merchant: merchantId,
    product: productId,
    category: categoryId,
    lot: lotId,
    stores: stores,
  });

  return merchantProduct.save();

}

// GET MERCHANT PRODUCTS
merchantProductSchema.methods.getMerchantProducts = function (merchantId) {

  return MerchantProduct.find().where({ merchant: merchantId }).populate({
    path:'category',
    model:'Category'
  }).populate({
    path:'product',
    model:'Product'
  }).populate({
    path:'lot',
    model:'Lot'
  }).populate({
    path:'stores',
    model:'Store'
  });

}

// GET SINGLE MERCHANT PRODUCT
merchantProductSchema.methods.getMerchantProduct = function (merchantProductId) {

  return MerchantProduct.find().where({ _id: merchantProductId }).populate({
    path:'category',
    model:'Category'
  }).populate({
    path:'product',
    model:'Product'
  }).populate({
    path:'lot',
    model:'Lot',
  }).populate({
    path:'stores',
    model:'Store'
  });

}

module.exports = MerchantProduct;

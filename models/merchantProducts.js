var mongoose = require('mongoose');

var Category = require('./categories');
var Lot = require('./lots');
var Merchant = require('./merchants');
var Product = require('./products');

var merchantProductSchema = new mongoose.Schema({
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  lot: { type: [ mongoose.Schema.Types.ObjectId ], ref: "Lot", required: true }
});

var MerchantProduct = mongoose.model('MerchantProduct', merchantProductSchema);

// NEW MERCHANT SALE METHOD
merchantProductSchema.methods.addMerchantProduct = function (merchantId, productId, categoryId, lotId) {

  var merchantProduct = new MerchantProduct({
    merchant: merchantId,
    product: productId,
    category: categoryId,
    lot: lotId
  });

  return merchantProduct.save();

}

module.exports = MerchantProduct;

var mongoose = require('mongoose');

var Merchant = require('./merchants');
var Store = require('./stores');
var User = require('./users');

var merchantClientSchema = new mongoose.Schema({
  merchantId: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant" },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

var MerchantClient = mongoose.model('MerchantClient', merchantClientSchema);

// CHECK IF MERCHANT CLIENT EXIST METHOD
merchantClientSchema.methods.checkMerchantClient = function (userId) {

  return MerchantClient.findOne({userId: userId});

}

// NEW MERCHANT CLIENT METHOD
merchantClientSchema.methods.newMerchantClient = function (merchant, store, user) {

  var merchantClient = new MerchantClient({
    merchantId: merchant,
    storeId: store,
    userId: user
  });

  return merchantClient.save();

}

module.exports = MerchantClient;

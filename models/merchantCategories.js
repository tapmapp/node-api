var mongoose = require('mongoose');

var Merchant = require('./merchants');
var Category = require('./categories');

var merchantCategorySchema = new mongoose.Schema({
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }
});

var MerchantCategories = mongoose.model('MerchantCategory', merchantCategorySchema);

// GET MERCHANT CATEGORIES
merchantCategorySchema.methods.getMerchantCategories = function(merchantId) {

  return MerchantCategories.find().where({ merchant: merchantId }).exec();

}

// ADD MERCHANT CATEGORY
merchantCategorySchema.methods.addMerchantCategory = function(merchantId, categoryId) {

  var merchantCategory = new MerchantCategories({
    merchant: merchantId,
    category: categoryId
  });

  return merchantCategory.save();

}

module.exports = MerchantCategories;



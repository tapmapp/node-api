var mongoose = require('mongoose');

var Merchant = require('../models/merchants');

var categorySchema = new mongoose.Schema({
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant" }, 
  name: { type: String, required: true, unique: true }
});

var Category = mongoose.model('Category', categorySchema);

// NEW CATEGORY
categorySchema.methods.newCategory = function (merchantId, categoryName) {

  var category = new Category({
    merchant: merchantId,
    name: categoryName
  });

  return category.save();

}

// UPDATE CATEGORY
categorySchema.methods.updateCategory = function (merchantId, categoryName) {
  
  var query = { merchant: req.user.username };
  var newData = { name: categoryName }

  return Category.findOneAndUpdate(query, newData);

}

// DELETE CATEGORY
categorySchema.methods.deleteCategory = function (merchantId, categoryName) {

  return Category.find({ merchant: merchantId }).remove().exec();

}

module.exports = Category;
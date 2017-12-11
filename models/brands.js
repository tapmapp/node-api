var mongoose = require('mongoose');

var brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

var Brands = mongoose.model('Brand', brandSchema);

brandSchema.methods.getBrands = function() {
  return Brands.find().exec();
}

module.exports = Brands
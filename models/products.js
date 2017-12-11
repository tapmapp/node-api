var mongoose = require('mongoose');

var Brand = require('./brands');

var productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
  brandName: { type: String, required: true },
  size: { type: String, required: true },
  img: String
});

var Product = mongoose.model('Product', productSchema);

// ADD PRODUCT
productSchema.methods.addProduct = function(name, brandId, brandName, size, img) {

  var product = new Product({
    name: name,
    brand: brandId,
    brandName: brandName,
    size: size,
    img: img
  });

  return product.save();

}

module.exports = Product;
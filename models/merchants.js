var mongoose = require('mongoose');

var merchantSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  address: { type: String, required: true },
  postalCode: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  password: { type: String, required: true },
  created: { type: Date, default: Date.now }
});

var Merchant = mongoose.model('Merchant', merchantSchema);

// NEW MERCHANT SALE METHOD
merchantSchema.methods.merchantInfo = function (merchantId) {

  return Merchant.findOne({ _id: merchantId }).exec();

}

module.exports = Merchant;
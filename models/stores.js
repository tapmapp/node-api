var mongoose = require('mongoose');

var Merchant = require('../models/merchants');

var storeSchema = new mongoose.Schema({
  merchantId: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant" },
  name: { type: String, required: true },
  address: { type: String, required: true },
  postalCode: { type: String, required: true},
  city: { type: String, required: true },
  country: { type: String, required: true},
  phone: { type: String, required: false },
  lat: { type: Number, required: false },
  long: { type: Number, required: false }
});

var Store = mongoose.model('Store', storeSchema);

// NEW MERCHANT SALE METHOD
storeSchema.methods.storesInfo = function (merchantId) {

  return Store.find({ 'merchantId' : merchantId });

}

module.exports = Store;
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-as-promised');

var merchantSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: false },
  type: { type: String, required: true },
  address: { type: String, required: false },
  postalCode: { type: String, required: false },
  city: { type: String, required: false },
  country: { type: String, required: false },
  password: { type: String, required: true },
  created: { type: Date, default: Date.now }
});

var Merchant = mongoose.model('Merchant', merchantSchema);

// CREATE ENCRYPTED PASSWORD
merchantSchema.methods.encryptPassword = function(password) {
  return bcrypt.hash(password, 10);
}

// CHECK IF PASSWORD MATCH
merchantSchema.methods.validPassword = function(password, farmerPassword) {
  return bcrypt.compare(password, farmerPassword);
}

// FIND MERCHANT BY EMAIL
merchantSchema.methods.find = function(email) {
  return Merchant.findOne({ email: email }).exec();
}

// FIND MERCHANT BY ID
merchantSchema.methods.findById = function(merchantId) {
  return Merchant.findOne({ _id: merchantId }).exec();
}

// CREATE MERCHANT
merchantSchema.methods.save = function (
  merchantEmail, 
  merchantType,
  merchantPassword,
) {

  var merchant = new Merchant({
    email: merchantEmail,
    type: merchantType,
    password: merchantPassword,
  });

  return merchant.save();

}

// NEW MERCHANT SALE METHOD
merchantSchema.methods.merchantInfo = function (merchantId) {
  return Merchant.findOne({ _id: merchantId }).exec();
}

// DELETE MERCHANT
merchantSchema.methods.delete = function(merchantId) {
  return Merchant.remove({ _id: merchantId}).exec();
}

module.exports = Merchant;
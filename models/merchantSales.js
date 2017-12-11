var mongoose = require('mongoose');

var Merchant = require('./merchants');
var Sale = require('./sales');

var merchantSaleSchema = new mongoose.Schema({
  merchantId:  { type: mongoose.Schema.Types.ObjectId, ref: "Merchant" },
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Sale" }
});

var MerchantSale = mongoose.model('MerchantSale', merchantSaleSchema);

// NEW MERCHANT SALE METHOD
merchantSaleSchema.methods.newMerchantSale = function (merchant, ticket) {
  
  var merchantSale = new MerchantSale({
    merchantId: merchant,
    ticketId: ticket
  });

  return merchantSale.save();

}

module.exports = MerchantSale;
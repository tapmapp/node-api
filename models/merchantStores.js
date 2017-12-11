var mongoose = require('mongoose');

var Merchant = require('./merchants');
var Store = require('./stores');

var merchantStoreSchema = new mongoose.Schema({
  merchantId:  { type: mongoose.Schema.Types.ObjectId, ref: "Merchant" },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" }
});

var MerchantStore = mongoose.model('MerchantStore', merchantStoreSchema);

merchantStoreSchema.methods.newMerchantStore = function (merchant, store, res) {

  var store = new MerchantStore({
    merchantId: merchant,
    storeId: store
  });

  store.save(function (err) {

    if (err) {

      var json = JSON.stringify(false);
      res.end(json);

    } else {

      console.log('Merchant Store Saved!');
      var json = JSON.stringify(true);
      res.end(json);

    }

  });

}

module.exports = MerchantStore;
var mongoose = require('mongoose');

var Store = require('./stores');

var lotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  acqPrice: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  units: { type: Number, required: true },
  expDate: { type: Date },
  store: { type: [ mongoose.Schema.Types.ObjectId ], ref: "Store", required: true },
  date: { type: Date, default: Date.now, required: true },
  active: { type: Boolean, required: true, default: false }
});

var Lot = mongoose.model('Lot', lotSchema);

// CREATE NEW LOT
lotSchema.methods.newLot = function (lotName, acqPrice, salePrice, units, expDate, store) {

  var lot = new Lot({
    name: lotName, 
    acqPrice: acqPrice,
    salePrice: salePrice,
    units: units,
    expDate: expDate,
    store: store,
    active: false,
  });

  return lot.save();

}

lotSchema.methods.setLotUnits = function (lotId, units) {

}

lotSchema.methods.closeLot = function (lotId) {

}

module.exports = Lot;
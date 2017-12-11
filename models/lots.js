var mongoose = require('mongoose');

var Store = require('./stores');

var lotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  acqPrice: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  units: { type: Number, required: true },
  expDate: { type: Date, required: true },
  store: { type: [ mongoose.Schema.Types.ObjectId ], ref: "Store", required: true },
  date: { type: Date, default: Date.now },
  active: { type: Boolean, required: true, default: false }
});

var Lot = mongoose.model('Lot', lotSchema);

lotSchema.methods.createLot = function (lot, res) {

}

lotSchema.methods.setLotUnits = function (lot, units, res) {

}

lotSchema.methods.closeLot = function (lot, res) {

}

module.exports = Lot;
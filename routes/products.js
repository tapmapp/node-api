var express = require('express');
var router = express.Router();

var Brand = require('../models/brands');
var Lot = require('../models/lots');
var MerchantProduct = require('../models/merchantProducts');
var Product = require('../models/products');
var Stores = require('../models/stores');


/* GET MERCHANT PRODUCTS */
router.get('/merchant-products', function(req, res, next) {

  res.writeHead(200, {"Content-Type": "application/json"});
  
  MerchantProduct.find().where('merchant', '5990895d94c8cd56cee5c941').populate({
        path:'category',
        model:'Category'
    }).populate({
        path:'product',
        model:'Product'
    }).populate({
        path:'lot',
        model:'Lot'
    }).exec(function (err, merchantProducts) {
      
    var products = [];
    var lots = [];

    for(var merchantProduct in merchantProducts) {

      products.push({
        _id: merchantProducts[merchantProduct]._id,
        productId: merchantProducts[merchantProduct].product._id,
        name: merchantProducts[merchantProduct].product.name,
        brand: merchantProducts[merchantProduct].product.brand,
        brandName: merchantProducts[merchantProduct].product.brandName,
        size: merchantProducts[merchantProduct].product.size,
        img: merchantProducts[merchantProduct].product.img,
        category: merchantProducts[merchantProduct].category,
        lot: merchantProducts[merchantProduct].lot
      });
      
    }

    // RETURN PRODUCT
    var json = JSON.stringify(products);
    res.end(json);

  });
  
});


/* ADD PRODUCT */
router.post('/add', function(req, res, next) {
  
  var product = new Products({ 
    name: products[i].name,
    brand: products[i].brand,
    img: products[i].category
  });

  product.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Product Done!');
    }
  });

  res.end();

});

/* ADD MERCHANT PRODUCT */
router.post('/add-merchant-product', function(req, res, next) {

  var newDate = new Date();
  var newTime = newDate.getTime() + (1000 * 60 * 60 * 24 * 365);

  var lot = new Lot({
    name: req.body.product.lot,
    acqPrice: req.body.product.acqPrice,
    salePrice: req.body.product.salePrice,
    units: req.body.product.units,
    expDate: new Date(new Date(newTime)),
    store: req.body.product.stores
  });

  lot.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Lot Done!');
    }
  });

  var merchantProduct = new MerchantProduct({
    merchant: '5990895d94c8cd56cee5c941',
    product: req.body.product._id,
    category: req.body.product.category,
    lot: lot._id
  });

  merchantProduct.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Merchant Product Done!');
    }
  });

  res.end();

});

/* EDIT MERCHANT PRODUCT */
router.post('/edit-merchant-product', function(req, res, next) {
  
  console.log(req.body.product);
  /*
    Lot.update({ _id: req.body.product.id }, { $set: {
      name: req.body.lot.name,
      acqPrice: req.body.lot.acqPrice,
      salePrice: req.body.lot.salePrice,
      units: req.body.lot.units,
      expDate: rreq.body.lot.expDate,
      store: req.body.lot.stores,
      date: new Date()
    }}, callback);
  
    Lot.update({ merchant: req.body.merchantId, product: req.body.productId }).exec(function (err) {
      var json = JSON.stringify(true);
      res.end(json);
    });
  */

});

/* EDIT MERCHANT LOT */
router.post('/edit-merchant-lot', function(req, res, next) {
  
  console.log(req.body.lot);
  /*
    Lot.update({ _id: req.body.product.id }, { $set: {
      name: req.body.lot.name,
      acqPrice: req.body.lot.acqPrice,
      salePrice: req.body.lot.salePrice,
      units: req.body.lot.units,
      expDate: rreq.body.lot.expDate,
      store: req.body.lot.stores,
      date: new Date()
    }}, callback);
  */
  /*Lot.update({ merchant: req.body.merchantId, product: req.body.productId }).exec(function (err) {
    var json = JSON.stringify(true);
    res.end(json);
  });*/
});

/* REMOVE MERCHANT PRODUCT */
router.post('/delete-merchant-product', function(req, res, next) {
  MerchantProduct.find({ _id: req.body.productId }).remove().exec(function (err) {
    var json = JSON.stringify(true);
    res.end(json);
  });
});

/* FIND PRODUCT */
router.post('/find', function(req, res, next) {
  
  Product.find({ 
    $or:[
      { name: { $regex: new RegExp(req.body.productString, 'i') }}, 
      { brandName: { $regex: new RegExp(req.body.productString, 'i') }}
    ] }).populate('brand._id').exec(function (err, products) {

      var json = JSON.stringify(products);
      res.end(json);

    });

});

module.exports = router;

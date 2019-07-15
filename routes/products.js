var express = require('express');
var router = express.Router();
var multer = require('multer');

// MODELS
var Lot = require('../models/lots');
var MerchantProduct = require('../models/merchantProducts');
var Product = require('../models/products');
var checkAuth = require('../middleware/check.auth');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/img/products/');
  }, 
  filename: function(req, file, cb) {

    // DELETE WHITE SPACES
    file.originalname = file.originalname.replace(/ /g,'');

    cb(null, new Date().getTime() + '-' + file.originalname);
  }
});

var upload = multer({ storage: storage });

/* ADD PRODUCT */
router.post('/new-product', checkAuth, function(req, res, next) {

  var name = req.body.name;
  var brandId = req.body.brandId;
  var brandName = req.body.brandName;
  var size = req.body.size;
  var img = req.body.img;
  
  var newProduct = Product.schema.methods.addProdutct(name, brandId, brandName, size, img);
  newProduct.then(newProduct => {
    
    // RETURN MERCHANT INFO
    res.status(200).json({
      response: {
          code: 200,
          message: 'New product created',
          status: '',
      },
      result: newProduct
    });

  }).catch(err => {

    // HANDLE ERROR
    res.status(err.statusCode || 500).json(err);

  });

});

/* UPLOAD PRODUCT IMAGE */
router.post('/file-upload', checkAuth, upload.single('product-image'), function(req, res, next) {

  // RETURN MERCHANT INFO
  res.status(200).json({
    response: {
        code: 200,
        message: 'Product image uploaded correctly',
        status: '',
    },
    result: {
      fileName: req.file.filename,
      destination: req.file.destination,
    }
  });

});

// GET PRODUCT IMAGE
router.get('/images/:fileProductName', function(req, res, next) {
  res.sendfile(`/img/products/${req.params.fileProductName}`, {root: './public'});
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
    merchant: req.body.merchantId,
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

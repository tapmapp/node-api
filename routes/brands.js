var express = require('express');
var router = express.Router();

var Brands = require('../models/brands');

// GET ALL BRANDS
router.get('/', function(req, res, next) {

  var brands = Brands.schema.methods.getBrands();
  brands.then(function(brands) {

    // RETURN ALL BRANDS
    var json = JSON.stringify(brands);
    res.end(json);

  }, function(err) {

    // RETURN FALSE IF ERROR
    var json = JSON.stringify(false);
    res.json(json);

  });

});

module.exports = router;

var express = require('express');
var router = express.Router();

var Store = require('../models/stores');

/* GET home page. */
router.get('/', function(req, res, next) {

  var stores = Store.schema.methods.storesInfo('5990895d94c8cd56cee5c941');
  stores.then(function(merchantStores) {

    var json = JSON.stringify(merchantStores);
    res.end(json);

  }, function(err){

  });

});

module.exports = router;

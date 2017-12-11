var express = require('express');
var router = express.Router();

var MerchantProduct = require('../models/merchantProducts');
var Category = require('../models/categories');

/* GET home page. */
router.get('/', function(req, res, next) {

  res.writeHead(200, {"Content-Type": "application/json"});

  MerchantProduct.find().where('merchant', '5990895d94c8cd56cee5c941').populate('category').exec(function (err, merchantProducts) {
    Category.find().where('merchant', '5990895d94c8cd56cee5c941').exec(function (err, categories) {

      var flag = 0;
      var merchantCategories = [];  
      
      for(var category in categories) {
        merchantCategories.push({
          _id: categories[category]._id,
          name: categories[category].name,
          items: 0
        });
      }
      
      for(var merchantProduct in merchantProducts) {
        for(var merchantCategory in merchantCategories) {
          if(merchantProducts[merchantProduct].category.id == merchantCategories[merchantCategory]._id) {
            merchantCategories[merchantCategory].items = merchantCategories[merchantCategory].items + 1;
          }
        }
      }

      var json = JSON.stringify(merchantCategories);
      res.end(json);

    });
  });

});

module.exports = router;

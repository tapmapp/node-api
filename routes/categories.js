var express = require('express');
var router = express.Router();

var MerchantProduct = require('../models/merchantProducts');
var MerchantCategories = require('../models/merchantCategories');
var Category = require('../models/categories');

/* GET MERCHANT CATEGORIES */
router.get('/:merchantId', function(req, res, next) {

  MerchantCategories.find().where('merchant', req.params.merchantId).populate({
    path: 'category',
    model: 'Category',
    select: { name: 1 }
  }).exec(function (err, merchantCategories) {

    let merchantCategoriesRes = [];

    for(let i = 0; i < merchantCategories.length; i++) {

      merchantCategoriesRes.push({
        _id: merchantCategories[i]._id,
        items: merchantCategories[i].items,
        name: merchantCategories[i].category.name,
        categoryId: merchantCategories[i].category._id,
      })

    }

    // RETURN MERCHANT INFO
    res.status(200).json({
      response: {
          code: 200,
          message: 'Merchant information found',
          status: '',
      },
      result: {
          merchantInfo: merchantCategoriesRes
      }
    });

  }).catch(err => {

    // HANDLE ERROR
    res.status(err.statusCode || 500).json(err);

  });

});

/* ADD MERCHANT CATEGORY */
router.post('/add-category', function(req, res, next) {

  var newMerchantCategory = MerchantCategories.schema.methods.addCategory(req.body.merchantId, req.body.categoryName);
  newMerchantCategory.then(newMerchantCategory => {

    // RETURN MERCHANT INFO
    res.status(200).json({
      response: {
          code: 200,
          message: 'Merchant category created',
          status: '',
      },
      result: {}
    });

  }).catch(err => {

    // HANDLE ERROR
    res.status(err.statusCode || 500).json(err);

  });    

});



/* GET home page. */
/*
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
          items: categories[category].items,
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
*/
module.exports = router;

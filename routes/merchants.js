var express = require('express');
var router = express.Router();

var Merchant = require('../models/merchants');

/* GET home page. */
router.get('/merchant-info', function(req, res, next) {

    var merchantInfo = Merchant.schema.methods.merchantInfo('5990895d94c8cd56cee5c941');
    merchantInfo.then(function(merchantInfo) {

        // RETURN MERCHANT INFO
        var json = JSON.stringify(merchantInfo);
        res.end(json);

    }, function(err) {

        // RETURN FALSE IF ERROR
        var json = JSON.stringify(false);
        res.end(json);

    });

});

module.exports = router;

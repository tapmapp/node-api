var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var merchant = require('../models/merchants');

// CREATE ACCOUNT
router.post('/', function(req, res, next) {
    console.log(req);
});

module.exports = router;

var express = require('express');
var router = express.Router();

var MerchantClient = require('../models/merchantClients');
var Sale = require('../models/sales');
var User = require('../models/users');

// CLIENT INFO
router.post('/client-info', function(req, res, next) {
  
  var userInfo = User.schema.methods.userInfo(req.body.clientId);
  userInfo.then(function(userInfo) {

    // RETURN USER INFO
    var json = JSON.stringify(userInfo);
    res.end(json);

  }, function(err){

    // HANDLE ERROR HERE
    res.end(err);

  });

});

// CREATE NEW USER
router.post('/new-user', function(req, res, next) {

  //email, name, lastName, address, postalCode, city, country, dateBirth, genre, password, created, status, img
  var createUser = User.schema.methods.createUser('test@email.com', 'Jacobo', 'Roca', 'Pilar Cavero', '28043', 'Madrid', 'Spain', '12-10-1987', 'Male', 'password', new Date(), false, 'jacobo.jpg');
  createUser.then(function(){

    // NEW USER CREATED  
    res.end(true);
  
  }, function(err){

    // HANDLE ERROR HERE
    res.end(err);

  });
  

});

module.exports = router;

var express = require('express');
var checkAuth = require('../middleware/check.auth');
var router = express.Router();

var MerchantClient = require('../models/merchantClients');
var Sale = require('../models/sales');
var User = require('../models/users');

// GET MERCHANT CLIENTS
router.get('/merchant-clients/:merchantId', (req, res, next) => {

  var merchantClients = MerchantClient.schema.methods.getMerchantClients(req.params.merchantId);
  merchantClients.then((merchantClients) => {

    // RETURN MERCHANT CLIENTS
    res.status(200).json({
      response: {
          code: 200,
          message: 'Merchant clients found',
          status: '',
      },
      result: {
          merchantClients: merchantClients
      }
    });

  }).catch(err => {

    // ERROR RESPONSE
    res.status(err.statusCode || 500).json(err);

  });

});

// CLIENT DETAILS
router.get('/:clientId', checkAuth, (req, res, next) => {
  
  var clientDetails = User.schema.methods.userInfo(req.params.clientId);
  clientDetails.then(clientDetails => {

    // RETURN MERCHANT CLIENTS
    res.status(200).json({
      response: {
          code: 200,
          message: 'Merchant clients found',
          status: '',
      },
      result: clientDetails,
    });

  }).catch(err => {

    // ERROR RESPONSE
    res.status(err.statusCode || 500).json(err);

  });

});

// CREATE NEW USER
router.post('/new-user', (req, res, next) => {

  //email, name, lastName, address, postalCode, city, country, dateBirth, genre, password, created, status, img
  var createUser = User.schema.methods.createUser('test@email.com', 'Jacobo', 'Roca', 'Pilar Cavero', '28043', 'Madrid', 'Spain', '12-10-1987', 'Male', 'password', new Date(), false, 'jacobo.jpg');
  createUser.then(() => {

    // NEW USER CREATED  
    res.end(true);
  
  }).catch(err => {

    // HANDLE ERROR HERE
    res.end(err);

  });
  

});

// GET CLIENT IMAGE
router.get('/images/:fileClientName', (req, res, next) => {
  res.sendfile(`/img/users/${req.params.fileClientName}`, {root: './public'});
});

module.exports = router;

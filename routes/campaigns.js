var express = require('express');
var router = express.Router();

var Campaign = require('../models/campaigns');
var ClientsList = require('../models/clientsLists');

// GET MERCHANTS CAMPAIGNS
router.get('/get-campaigns', function(req, res, next) {

  var merchantCampaigns = Campaign.schema.methods.getCampaigns('5990895d94c8cd56cee5c941');
  merchantCampaigns.then(function(merchantCampaigns) {

    // RETURN MERCHANT CAMPAIGNS
    var json = JSON.stringify(campaigns);
    res.end(json);

  }, function(err){

    // RETURN FALSE IF ERROR
    var json = JSON.stringify(false);
    res.json(json);

  });

});

// GET CLIENTS LISTS
router.get('/clients-lists', function(req, res, next) {
  
  // GET CLIENTS LISTS
  var clientsLists = ClientsList.schema.methods.getClientLists('5990895d94c8cd56cee5c941');
  clientsLists.then(function(clientsLists) {

    // RETURN CLIENTS LISTS
    var json = JSON.stringify(clientsLists);
    res.end(json);

  }, function(err){

    // RETURN FALSE IF ERROR
    var json = JSON.stringify(false);
    res.end(json);

  });

});

// NEW CLIENT LIST
router.post('/new-clients-list', function(req, res, next) {
  
  // NEW CLIENTS LISTS
  var createClientsList = ClientsList.schema.methods.newClientsList('5990895d94c8cd56cee5c941', req.body.clientsListName);
  createClientsList.then(function() {

    // GET CLIENTS LISTS IF SUCCESS
    return ClientsList.schema.methods.getClientLists('5990895d94c8cd56cee5c941');

  }, function(err){

    // RETURN FALSE IF ERROR
    var json = JSON.stringify(false);
    res.end(json);

  }).then(function(clientsLists) {

    // RETURN CLIENTS LISTS
    var json = JSON.stringify(clientsLists);
    res.end(json);

  }, function(err) {

    // RETURN FALSE IF ERROR
    var json = JSON.stringify(false);
    res.end(false);

  });;

});

// SET CAMPAIGN STATE
router.post('/set-campaign-state', function(req, res, next) {

  let campaignId= req.body.campaignData.campaignId;
  let campaignState = req.body.campaignData.campaignState;

  var setCampaignState = Campaign.schema.methods.setState(campaignId, campaignState);
  setCampaignState.then(function() {

    // RETURN TRUE IF SUSCCESS
    var json = JSON.stringify(true);
    res.json(json);

  }, function(err){
    
    // RETURN FALSE IF ERROR
    var json = JSON.stringify(false);
    res.json(json);

  });

});

module.exports = router;

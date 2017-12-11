var mongoose = require('mongoose');

var ClientsList = require('../models/clientsLists');
var Merchant = require('../models/merchants');

var campaignSchema = new mongoose.Schema({
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant" }, 
  type: { type: String, required: true },
  name: { type: String, required: true },
  promotion: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  state: { type: Boolean, required: true },
  clientsList: { type: mongoose.Schema.Types.ObjectId, ref: "ClientsList", required: true }
});

var Campaign = mongoose.model('Campaign', campaignSchema);

// GET CAMPAIGNS
campaignSchema.methods.getCampaigns = function (merchantId) {

  return Campaign.find({ 
    merchant: merchantId 
  }).populate({
      path: 'clientsList',
      model: 'ClientsList',
      select: { name: 1 }
  });

}

// NEW CAMPAIGN
campaignSchema.methods.newCampaign = function (merchantId, campaignData) {

  var campaign = new Campaign({
    merchant: merchantId, 
    type: campaignData.type,
    name: campaignData.name,
    promotion: campaignData.promotion,
    startDate: campaignData.startDate,
    endDate: campaignData.endDate,
    state: campaignData.state,
    clientsList: campaignData.clientsListId
  });

  return campaign.save();

}

// UPDATE CAMPAIGN
campaignSchema.methods.updateCampaign = function (campaignId, newCampaignData) {
  
  var query = { _id: campaignId };

  var newData = { 
    merchant: newCampaignData.merchantId, 
    type: newCampaignData.type,
    name: newCampaignData.name,
    promotion: newCampaignData.promotion,
    startDate: newCampaignData.startDate,
    endDate: newCampaignData.endDate,
    state: newCampaignData.state,
    clientsList: newCampaignData.clientsListId 
  };

  return Campaign.findOneAndUpdate(query, newData);

}

// SET CAMPAIGN STATE
campaignSchema.methods.setState = function (campaignId, campaignState) {
  
  var query = { _id: campaignId };

  var newData = { 
    state: campaignState
  };

  return Campaign.findOneAndUpdate(query, newData);

}

// REMOVE CAMPAIGN
campaignSchema.methods.removeCampaign = function (campaignId) {

  return Campaign.find({ _id: campaignId }).remove().exec();

}

module.exports = Campaign;
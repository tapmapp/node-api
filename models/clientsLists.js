var mongoose = require('mongoose');

var Merchant = require('./merchants');
var User = require('./users');

var clientsListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  merchantId: {  type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true },
  users: { type: [ mongoose.Schema.Types.ObjectId ], ref: "User" }
});

var ClientsList = mongoose.model('ClientsList', clientsListSchema);

// NEW CLIENT LIST
clientsListSchema.methods.newClientsList = function (merchantId, name) {

  var clientsList = new ClientsList({
    name: name,
    merchantId: merchantId,
    users: []
  });

  return clientsList.save();

}

// GET CLIENTS LISTS
clientsListSchema.methods.getClientLists = function (merchantId) {

  return ClientsList.find().where({
    merchantId: merchantId
  }).populate({
    path: 'users',
    model: 'User'
  }).exec();

}

// ADD CLIENT TO LIST
clientsListSchema.methods.addClientsToList = function (clientsListId, clientId) {

}

// EDIT CLIENT LIST
clientsListSchema.methods.editClientList = function (clientsListId, clientListName) {

}

// REMOVE CLIENT FROM LIST
clientsListSchema.methods.removeClientFromList = function (clientsListId, clientId) {

}

// REMOVE CLIENT LIST
clientsListSchema.methods.removeClientList = function (clientsListId) {

}

module.exports = ClientsList;
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: false },
  postalCode: { type: String, required: false },
  city: { type: String, required: false },
  country: { type: String, required: false },
  dateBirth: { type: String },
  genre: { type: String},
  password: { type: String, required: true },
  created: { type: Date, default: Date.now },
  status: { type: Boolean, default: false },
  img: { type: String }
});

var User = mongoose.model('User', userSchema);

userSchema.methods.createUser = function (email, name, lastName, address, postalCode, city, country, dateBirth, genre, password, created, status, img) {

  var user = new User({
    email: email,
    name: name,
    lastName: lastName,
    address: address,
    postalCode: postalCode,
    city: city,
    country: country,
    dateBirth: dateBirth,
    genre: genre,
    password: password,
    created: created,
    status: status,
    img: img
  });

  return user.save();

}

userSchema.methods.userInfo = function(userId) {

  return User.find().where({ _id: userId });

}

module.exports = User;
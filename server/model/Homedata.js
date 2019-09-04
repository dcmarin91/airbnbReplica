const mongoose = require('mongoose');


const homedataSchema = mongoose.Schema({
  description: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  guests: String,
  placeType: String,
  adress: String,
  city: String,
  state: String,
  marker_lat: String,
  marker_lng: String,
  lat: String,
  lng: String,
  cost: Number,
  image: String,
});


const Homedata = mongoose.model('Homedata', homedataSchema);

module.exports = Homedata;

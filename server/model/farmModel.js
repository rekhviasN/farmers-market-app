var mongoose = require('mongoose');

//creates schema for geoJSON database objec
var market = new mongoose.Schema({
  Address: String,
  GoogleLink: String,
  Products: String,
  Schedule: String,
  geometry: {  type: { type: String } , coordinates: { type: [Number] } },
  Name: String  
}); 

module.exports = mongoose.model('market', market);
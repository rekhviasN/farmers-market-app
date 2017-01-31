var serverRoutes = require('express').Router();
var marketController = require('../controllers/marketController');


// invoked to make query to DB
serverRoutes.route('/api/search')
.get((req, res) => {
  marketController.getLocationMarkets(req, res);
});

// invoke to add a new market to DB
serverRoutes.route('/api/create')
.post((req, res) => {
  // invoke marketController.createMarket to add a new market to DB
  marketController.createMarket(req, res);
});

//invoked to return a market to display to admin prior to update or edits
serverRoutes.route('/api/getOne')
.post((req,res) => {

  marketController.fetchOne(req, res);

});

//invoked to update an existing market
serverRoutes.route('/api/update')
.put((req,res)=>{

	marketController.updateOne(req, res);	
});

//invoked to delete an existing market
serverRoutes.route('/api/delete')
.put((req,res)=>{
	console.log(req.body, "obj in routes");
	marketController.delete(req,res);
});

//invoked to add a new farm
serverRoutes.route('/api/add')
.put((req,res)=>{
	marketController.addMarket(req,res);
});

module.exports = serverRoutes;

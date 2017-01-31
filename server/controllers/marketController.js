var Market = require('../model/farmModel.js');
var Q = require('q');
var rp = require('request-promise');
var MarketQuery = require('../methods/marketMethods');
var util = require('../util/util_functions');
var queryMarkets = Q.nbind(Market.find, Market);
var queryById = Q.nbind(Market.findById, Market);
var findAndUpdate = Q.nbind(Market.update, Market);
var findAndRemove = Q.nbind(Market.remove, Market);
var createMarket = Q.nbind(Market.create, Market)


module.exports = {

  //returns markets within a radius
	getLocationMarkets: (req, res, next) => {
		var address = util.replaceSpaceInAddress(req.query.address);
    var radius = util.convertMilesToKm(req.query.radius);
    console.log('here is the radius', radius);

		rp.get(
			`https://maps.googleapis.com/maps/api/geocode/json?address=${address}`
		).then((data) => {
			var coordinates = JSON.parse(data).results[0].geometry.location;
			console.log('successfully got geocode' + coordinates );
			var lng = Number(coordinates.lng);
		  var lat = Number(coordinates.lat);

		  var marketsDetails;

	    queryMarkets(

			   {
			     geometry: {
			        $nearSphere: {
			           $geometry: {
			              type : "Point",
			              coordinates : [ lng, lat ]
			           },
			           $minDistance: 0,
			           $maxDistance: radius || 1609.3 //distance must be in meters
			        }
			     }
			   }
	    )
	    .then((markets) => {
	      marketsDetails = markets;
	      res.json(marketsDetails);
	    })
	    .catch((err) => {
	      console.error('Failed', err);
	    });
		});
	},

  //adds a market
  addMarket: (req, res, next) => {
    console.log("received object in req.body", req.body);
    console.log("geo coordinates from received object ", req.body.market.geometry);
    Market.create({ Address: req.body.market.Address,
        GoogleLink: req.body.market.Link,
        Products: req.body.market.Products,
        Schedule: req.body.market.Schedule,
        Name: req.body.market.Name,
        geometry: req.body.market.geometry }, 
        function(err, newMarket){
          if(err){
            console.log("Error creating object!", err);
            res.send("error creating object!");
          }else{
            Market.collection.createIndex( { geometry : "2dsphere" } );
            res.send(newMarket);
            
          }
   });
  },

  //sends back a market prior to edits or deletes
  fetchOne: (req, res) => {
  	console.log("inside fetch; id from req.body:", req.body.marketId);
  	console.log();
  	queryById(req.body.marketId)
  		.then((doc)=>{ console.log( "doc from fetch", doc); 
  		  res.send(doc); 
  		})
  		.catch((err)=>{ 
  			console.log(err);
  			res.send('not found');
  		});
  },

  //updates a market
  updateOne: (req, res) =>{
  	console.log("obj received: ", req.body.updatedObj.data);
  	findAndUpdate({ _id: req.body.updatedObj.data._id},
  		{ '$set': { 'Address': req.body.updatedObj.data.Address,
  				  'Products': req.body.updatedObj.data.Products,
  				  'Schedule': req.body.updatedObj.data.Schedule,
  				  'Name': req.body.updatedObj.data.Name,
  				  'GoogleLink': req.body.updatedObj.data.GoogleLink,
  				  'geometry.coordinates' : req.body.updatedObj.data.geometry.coordinates
  				  }
  		},
  		()=> { res.send("updated");
  	});
  },

  //deletes a market
 delete: (req, res) => {
  	console.log("req.body data", req.body)
  	findAndRemove({ _id: req.body.market.data._id},
  		()=>{ res.send("item removed"); });
  }


};

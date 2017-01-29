var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var routes = require('./routes/routes.js');
var mongoose = require('mongoose');
var path = require('path');
var keys = require('../API_KEYS.js');


var app = express();
var port = process.env.PORT || 8080;

var mongoURI = process.env.mongoURI || keys.mongoURI;

// instead of just connecting to mlabs, we will be connecting to databse with a secret attached so jwt can be sent back
var database = keys.database;
mongoose.connect(database.database);

app.set('superSecret', database.secret);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(routes);
app.use(express.static(path.join(__dirname, '../client')));
// var routes = require('./routes.js')(app, express);

app.listen(port);
console.log("server running on port " + port);

module.exports = app;

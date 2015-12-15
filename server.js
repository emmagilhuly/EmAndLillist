//load the express package and create our app
var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  config = require('./config'),
  path = require('path'),

//App Configuration
//use body parser so we can grab info from post requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//configure our app to handle CORS requests
app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
})
  
//log all requests to the console
app.use(morgan('dev'))

//connect to our database
mongoose.connect('config.database')

//set the static files location
//used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));

//ROUTES FOR OUR API 
//====================================

//API ROUTES
var apiRoutes = require('./app/routes/api')(app, express)
//all of our routes prefixed with /api
app.use('/api', apiRoutes)

//MAIN CATCHALL ROUTE
//SEND USERS TO FRONT-END
//has to be registered after api routes
//set up our one route to the index.html file
app.get('*', function(req, res){
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
})

//START THE SERVER
app.listen(config.port)
console.log('port running on ' + config.port)

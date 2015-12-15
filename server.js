//load the express package and create our app
var express = require('express'),
  app = express(),
  path = require('path'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  User = require('./app/models/user'),
  config = require('./config'),
  apiRoutes = require('./app/routes/api')(app, express),
  port = process.env.PORT || 5000;

mongoose.connect('config.database')

//App Configuration
//use body parser so we can grab info from post requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//set the public folder to serve public assets
app.use(express.static(__dirname + '/public'));

//set up our one route to the index.html file
app.get('*', function(req, res){
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
})

//configure our app to handle CORS requests
app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
})

//log all requests to the console
app.use(morgan('dev'))

//REGISTER OUR ROUTES
//all of our routes prefixed with /api
app.use('/api', apiRoutes)

//START THE SERVER
app.listen(config.port)
console.log('port running on ' + config.port)

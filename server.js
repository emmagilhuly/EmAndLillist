//load the express package and create our app
var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  port = process.env.PORT || 4000;

mongoose.connect('mongodb://localhost/ellist')

//App Configuration
//use body parser so we can grab info from post requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//configure our app to handle CORS requests
app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, \ Authorization');
  next();
})

//log all requests to the console
app.use(morgan('dev'))

//ROUTES FOR OUR API
//basic route for homepage
app.get('/', function(req, res){
  res.send('welcome to the home page!')
})

//get an instance to express router
var apiRouter = express.Router()

//test route to make sure it works
//accessed at GET 4000/api
apiRouter.get('/', function(req, res){
  res.json({message: 'hooray! welcome to our api!'})
})

//more routes for api will happen here

//REGISTER OUR ROUTES
//all of our routes prefixed with /api
app.use('/api', apiRouter)

//START THE SERVER
app.listen(port)
console.log('port running on ' + port)









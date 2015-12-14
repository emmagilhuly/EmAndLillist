//load the express package and create our app
var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  User = require('./app/models/user'),
  port = process.env.PORT || 4000;

//get an instance to express router
var apiRouter = express.Router()

mongoose.connect('mongodb://localhost/ellist')

//App Configuration
//use body parser so we can grab info from post requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//middleware to use for all requests
apiRouter.use(function(req, res, next){
  //do logging
  console.log('someone just came to our app')
  //add more later
  //authenticate users
  next() //go to next routes, don't stop here
})

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

//test route to make sure it works
//accessed at GET 4000/api
apiRouter.get('/', function(req, res){
  res.json({message: 'hooray! welcome to our api!'})
})

//more routes for api will happen here
apiRouter.route('/users')
  //create a user (accessed at 4000/api/users)
  .post(function(req, res){
    //create new instance of user model
    var user = new User()
    //set the users information (comes from request)
    user.name = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;

    //save the user, check for errors
    user.save(function(err){
      if (err) {
        //duplicate entry
        if (err.code == 11000)
          return res.json({success: false, message: 'a user with that username already exists'})
        else
          return res.send(err)
      }
      res.json({message: 'user created!'})
    })
  })


//REGISTER OUR ROUTES
//all of our routes prefixed with /api
app.use('/api', apiRouter)

//START THE SERVER
app.listen(port)
console.log('port running on ' + port)









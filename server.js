//load the express package and create our app
var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  User = require('./app/models/user'),
  superSecret = "emmalily",
  port = process.env.PORT || 5000;

//get an instance to express router
var apiRouter = express.Router()

mongoose.connect('mongodb://localhost/ellist')

//App Configuration
//use body parser so we can grab info from post requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//basic route for homepage
app.get('/', function(req, res){
  res.send('welcome to the home page!')
})

//route to authenticate user port/api/authenticate
apiRouter.post('/authenticate', function (req, res){
  //find the user
  //select the name email username and password
  User.findOne({
    username: req.body.username
  }).select('name email username password').exec(function(err, user){
    if (err) throw err;
    //no user with that usernmae was found
    if (!user) {
      res.json({success: false, message: 'Authentication failed user not found'});
    } else if (user) {
      //check if passwords match
      var validPassword = user.comparePassword(req.body.password);
      if (!validPassword){
        res.json({success: false, message: 'Authentication failed wrong password'})
      } else {
        //if user is found and password is right, create a token
        var token = jwt.sign({
          name: user.name,
          username: user.username,
          email: user.email
        }, superSecret, {
          expireInMinutes: 1440 // expires in 24 hours
        });
        //return the info including token as json
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        })
      }
    }
  })
})

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
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
})

//log all requests to the console
app.use(morgan('dev'))

//ROUTES FOR OUR API

//test route to make sure it works
//accessed at GET 4000/api
apiRouter.get('/', function(req, res){
  res.json({message: 'hooray! welcome to our api!'})
})

//more routes for api will happen here
apiRouter.route('/users')
  //create a user (accessed at port/api/users)
  .post(function(req, res){
    //create new instance of user model
    var user = new User()
    //set the users information (comes from request)
    user.name = req.body.name;
    user.email = req.body.email;
    user.username = req.body.username;
    user.password = req.body.password;

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
  //get all the users (accessed at port/api/users)
  .get(function(req,res){
    User.find(function(err, users){
      if (err) res.send (err)

      //return the users
      res.json(users)
    })
  })

apiRouter.route('/users/:user_id')

  //get the user with that id, accessed at port/api/users/:user_id
  .get(function(req,res){
    User.findById(req.params.user_id, function (err, user){
      if (err) res.send (err);

      //return that user
      res.json(user)
    })
  })
  .put(function(req, res){
    //user our user model to find the user we want
    User.findById(req.params.user_id, function (err, user){
      if (err) res.send (err)
      //update the user's info only if its new
      if (req.body.name) user.name = req.body.name;
      if (req.body.username) user.username = req.body.username;
      if (req.body.email) user.email = req.body.email;
      if (req.body.password) user.password = req.body.password;

      //save the user
      user.save(function(err){
        if (err) res.send (err);

        //return a message
        res.json({message: 'User updated!'})
      })
    })
  })
  .delete(function(req, res){
        User.remove({
            _id: req.params.user_id
        }, function (err, user) {
            if (err) res.send (err);

            res.json({message: 'Successfully deleted'})
          })
  })

//REGISTER OUR ROUTES
//all of our routes prefixed with /api
app.use('/api', apiRouter)

//START THE SERVER
app.listen(port)
console.log('port running on ' + port)

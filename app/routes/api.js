var bodyParser = require('body-parser'); 	// get body-parser
var User       = require('../models/user');
var Item       = require('../models/item');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var apiRouter = express.Router();

	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {

	  // find the user
	  User.findOne({
	    username: req.body.username
	  }).select('name username password').exec(function(err, user) {

	    if (err) throw err;

	    // no user with that username was found
	    if (!user) {
	      res.json({
	      	success: false,
	      	message: 'Authentication failed. User not found.'
	    	});
	    } else if (user) {

	      // check if password matches
	      var validPassword = user.comparePassword(req.body.password);
	      if (!validPassword) {
	        res.json({
	        	success: false,
	        	message: 'Authentication failed. Wrong password.'
	      	});
	      } else {

	        // if user is found and password is right
	        // create a token
	        var token = jwt.sign({
	        	name: user.name,
	        	username: user.username,
						id: user._id
	        }, superSecret, {
	          expiresInMinutes: 1440 // expires in 24 hours
	        });

	        // return the information including token as JSON
	        res.json({
	          success: true,
	          message: 'Enjoy your token!',
	          token: token
	        });
	      }

	    }

	  });
	});

	apiRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res) {

			var user = new User();		// create a new instance of the User model
			user.name = req.body.name;  // set the users name (comes from the request)
			user.username = req.body.username;  // set the users username (comes from the request)
			user.password = req.body.password;  // set the users password (comes from the request)

			user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000)
						return res.json({ success: false, message: 'A user with that username already exists. '});
					else
						return res.send(err);
				}

				// return a message
				res.json({ message: 'User created!' });
			});
		})

		apiRouter.route('/items')

		// get all the items (accessed at GET http://localhost:8080/api/items)
		.get(function(req, res) {

			Item
			.find({})
			.populate('_creator')
			.exec(function(err, items) {
				if (err) res.send(err);

				// return the users
				res.json(items);
			});
		});


	// route middleware to verify a token
	apiRouter.use(function(req, res, next) {
		// do logging
		console.log('Somebody just came to our app!');

	  // check header or url parameters or post parameters for token
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];

	  // decode token
	  if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, superSecret, function(err, decoded) {

	      if (err) {
	        res.status(403).send({
	        	success: false,
	        	message: 'Failed to authenticate token.'
	    	});
	      } else {
	        // if everything is good, save to request for use in other routes
	        req.decoded = decoded;

	        next(); // make sure we go to the next routes and don't stop here
	      }
	    });

	  } else {

	    // if there is no token
	    // return an HTTP response of 403 (access forbidden) and an error message
   	 	res.status(403).send({
   	 		success: false,
   	 		message: 'No token provided.'
   	 	});

	  }
	});

	// test route to make sure everything is working
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });
	});

	// on routes that end in /users
	// ----------------------------------------------------
	apiRouter.route('/users')

		// get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res) {

			User
			.find({})
			.populate('items')
			.exec(function(err, users) {
				if (err) res.send(err);

				// return the users
				res.json(users);
			});
		});


	apiRouter.route('/items')

		// create a item (accessed at POST http://localhost:8080/items)
		.post(function(req, res) {

			var newItem = new Item();
			newItem.name = req.body.name;
			newItem.description = req.body.description;
			newItem.price = req.body.price;
			newItem.picture = req.body.picture;
			newItem.date = new Date()
			newItem._creator = req.decoded.id;
			console.log("New item:", newItem)

			newItem.save(function(err) {
				if (err) res.send (err)
				// return a message
				console.log('---ID--',req.decoded.id);
				User.findById(req.decoded.id, function(err, user){
					console.log("HELLO THIS IS " + " " + Object.keys(req.body) + " ")
					if (err) res.send (err)
					console.log(newItem)
					user.items.push(newItem)
					user.save(function(err){
						if (err) res.send(err);
					})
				})
				res.json({ message: 'Item created!' });
			});


		});


	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')

		// get the user with that id
		.get(function(req, res) {
			User
			.findById(req.params.user_id)
			.populate('items')
			.exec(function(err, user) {
				if (err) res.send(err);

				// return that user
				res.json(user);
			});
		})

		// update the user with this id
		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {

				if (err) res.send(err);

				// set the new user information if it exists in the request
				if (req.body.name) user.name = req.body.name;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;
				if (req.body.item) user.addItems(req.body.item);

				// save the user
				user.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'User updated!' });
				});

			});
		})

		//delete the user with this id
		.delete(function(req, res){
			User.remove({
				_id: req.params.user_id
			}, function (err, user) {
				if (err) res.send(err);

				res.json({message: 'Successfully deleted'})
			});
		});

	// api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});

	apiRouter.route('/items/:item_id')

		// get the item with that id
		.get(function(req, res) {
			Item.findById(req.params.item_id)
				.populate('_creator')
				.exec(function(err, item) {
				if (err) res.send(err);

				// return that item
				res.json(item);
			});
		})

		// update the item with this id
		.put(function(req, res) {
			Item.findById(req.params.item_id, function(err, item) {

				if (err) res.send(err);

				// set the new item information if it exists in the request
				if (req.body.name) item.name = req.body.name;
				if (req.body.description) item.description = req.body.description;
				if (req.body.price) item.price = req.body.price;
				if (req.body.picture) item.picture = req.body.picture;
				if (req.body.date) item.date = req.body.date;

				// save the item
				item.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'Item updated!' });
				});

			});
		})

		//delete the item with this id
		.delete(function(req, res){
			Item.remove({
				_id: req.params.item_id
			}, function (err, item) {
				if (err) res.send(err);

				res.json({message: 'Item successfully deleted'})
			});
		});

// apiRouter.post('/addItemsToUser',function(req,res){
// 	User.findById(req.token.id,function(err,user){
// 		user.addItems(req.body.item)
// 		user.save(function (err,user) {
// 			res.json(user)
// 		})
// 	})
//
// })

	return apiRouter;
};

var bodyParser = require('body-parser'),
	User = require('../models/user'),
	jwt = require('jsonwebtoken'),
	config = require('../../config');

//super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {
	var apiRouter = express.Router();

//route to authenticate a user (POST port/api/authenticate)
apiRouter.post('/authenticate', function(req, res){

	//find the user
	//select the pw since mongoose isn't returning it by default
	User.findOne({
		username: req.body.username
	}).select('name username password').exec(function(err, user){
		if (err) throw err
		//no user with that username was found
		if (!user) {
			res.json({success: false,
				message: 'Authentication failed. User not found'
			});
		} else if (user) {

			//check if password matches
			var validPassword = user.comparePassword(req.body.password)
			if (!validPassword) {
				res.json({success: false,
					message: 'Authentication failed. Wrong password.'
				})
			} else {
				//if user is found and password is right, create a token
				var token = jwt.sign({
					name: user.name,
					username: user.username
				}, superSecret, {
					expiresInMinutes: 1440 //24 hours
				});
				//return the information, token as JSON
				res.json({
					success: true,
					message: 'Enjoy your token.',
					token: token
				});
			}
		}
	});
});

//route middleware to verify token
apiRouter.use(function(req, res, next){
	//do logging
	console.log('somebody just came to our app')
	//check header or url parameters or post params for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	//decode token
	if (token) {
		//verifies secret and checks exp
		jwt.verify(token, superSecret, function(err, decoded){
			if (err) {
				res.status(403).send({
					success: false,
					message: "failed to authenticate token"
				});
			} else {
				//if all is good, save to request for use in other routes
				req.decoded = decoded;
				next(); //make sure we go to next route and don't stop here
			}
		});

	} else {
		//if there's no token, return HTTP response 403 (access forbidden) and error message
		res.status(403).send({
			success: false,
			message: 'no token provided'
		});
	}
})

//test route to make sure everything is working, access at GET port/api
apiRouter.get('/', function(req,res){
	res.json({message: 'hooray! welcome to our api!'})
})

//on routes that end in /users
apiRouter.route('/users')

	//create a user accessed at POST port/users
	.post(function(req,res){

		var user = new User(); //create a new instance of the User model
		user.name = req.body.name; //set the users name comes from the request
		user.username = req.body.username; // set the user's username comes from the request
		user.password = req.body.password;

		user.save(function(err){
			if (err){
				//duplicate entry
				if (err.code == 11000)
					return res.json({success: false, message: 'A user with that username already exist'});
				else
					return res.send(err);
				}
				//return a message
				res.json({message: 'user created'})
		});
	})

	//get all the users accessed at port/api/users
	.get(function(req, res){
		User.find({}, function(err, users){
			if (err) res.send(err);

			//return the users
			res.json(users);
		});
	});

//on the routes that end in /users/:user_id

apiRouter.route('users/:user_id')

	//get the user with that id
	.get(function(req, res){
		User.findById(req.params.user_id, function (err, user){
			if (err) res.send(err);

			//return that user
			res.json(user);
		})
	})

	//update the user with this id
	.put(function(req, res){
		User.findById(req.params.user_id, function(err,user){
			if (err) res.send(err);

			//set the new user information if it exists in the request
			if (req.body.name) user.name = req.body.name;
			if (req.body.username) user.username = req.body.username;
			if (req.body.password) user.password = req.body.password;

			//save the user
			user.save(function(err){
				if (err) res.send(err);

				//return a message
				res.json({message: 'User updated'});
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

	//api endpoint to get user info
	apiRouter.get('/me', function(req,res){
		res.send(req.decoded)
	});

	return apiRouter;

};

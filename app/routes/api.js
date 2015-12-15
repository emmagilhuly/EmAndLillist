var bodyParser = require('body-parser'),
	User = require('../models/user'),
	jwt = require('jsonwebtoken'),
	config = require('../../config')

//super secret for creating tokens	
var superSecret = config.secret

module.exports = function(app, express) {
	var apiRouter = express.Router()


//route to authenticate a user (POST port/api/authenticate)
apiRouter.post('/authenticate', function(req, res){
	console.log(req.body.username)

	//find the user
	//select the pw since mongoose isn't returning it by default
	User.findOne({
		username: req.body.username
	}).select('password').exec(function(err, user){
		if (err) throw err
		//no user with that username was found
		if (!user) {
			res.json({success: falso, message: 'Authentication failed. User not found'})
		} else if (user) {
			//check if password matches
			var validPassword = user.comparePassword(req.body.password)
			if (!validPassword) {
				res.json({success: false, message: "Authentication failed. Wrong password."})
			} else {
				//if user is found and password is right, create a token
				var token = jwt.sign(user, superSecret, {
					expiresInMinutes: 1440 //24 hours
				})
				//return the information, including token as JSON
				res.json({
					success: true,
					message: 'Enjoy your token.',
					token: token
				})
			}
		}
	})
})

//route middleware to verify token
apiRouter.use(function(req, res, next){
	//do logging
	console.log('somebody just came to our app')
	//check header or url parameters or post params for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];
	//decode token
	if (token) {
		//verifies secret and checks exp
		jwt.verify(token, superSecret, function(err, decoded){
			if (err) {
				return res.json({success: false, message: "failed to authenticate token"});
			} else {
				//if all is good, save to request for use in other routes
				req.decoded = decoded
				next() //make sure we go to next route and don't stop here
			}
		})
	} else {
		//if there's no token, return HTTP response 403 (access forbidden) and error message
		return res.status(403).send({success: false, message: 'no token provided'})
	}
})

//test route to make sure everything is working, access at GET port/api
apiRouter.get('/', function(req,res){
	res.json({message: 'hooray! welcome to our api!'})
})



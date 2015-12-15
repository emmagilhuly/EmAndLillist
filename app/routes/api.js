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







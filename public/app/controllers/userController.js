//inject the user service into our main Angular module
angular.module('userCtrl', ['userService'])

//create a controller and inject the User factory
.controller('userController', function(User){
	var self = this

	//set a processing variable to show loading things
	self.processing = true;

	//get all the users
	User.all()
		//promise object
		.success(function(data){
			//when all the users come back, remove processing variable
			self.processing = false
			//bind the data to a controller variable, this is from userService
			self.user = data;
		})
})

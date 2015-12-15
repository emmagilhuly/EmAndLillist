//inject the user service into our main Angular module
angular.module('userCtrl', ['userService'])

//create a controller and inject the User factory
.controller('userController', function(User){
	var self = this
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

	//function to delete user
	self.deleteUser = function(id) {
		//set a processing variable to show loading things
		self.processing = true;

		//accepts the user id as a parameter
		User.delete(id)
			.success(function(data){
			//get all the users
			User.all()
				//promise object
				.success(function(data){
					//when all the users come back, remove processing variable
					self.processing = false
					//bind the data to a controller variable, this is from userService
					self.users = data;
				})

			})
	}	

})

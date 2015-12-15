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

//controller applied to user creation page
.controller('userCreateController', function(User){
	var self = this;

	//variable to hide/show elements of the view
	//differentiates between create/edit pages
	self.type = 'create'

	//function to create user
	self.saveUser = function(){
		self.processing = true;

		//clear message
		self.message = '';

		//use the create function in userService
		User.create(self.userData)
			.success(function(data){
				self.processing = false

				//clear the form
				self.userData = {};
				self.message = data.message
			})
	}
})





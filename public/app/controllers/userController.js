//inject the user service into our main Angular module
angular.module('emAndLilApp', ['userService'])

//create a controller and inject the User factory
.controller('userController', function(User){
	var self = this
	//get all the users
	User.all()
		//promise object
		.success(function(data){
			//bind the data to a controller variable, this is from userService
			self.user = data;
		})
})
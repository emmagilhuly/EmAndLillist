angular.module('userCtrl', ['userService'])

.controller('userController', function(User) {

	var self = this;

	// set a processing variable to show loading things
	self.processing = true;

	// grab all the users at page load
	User.all()
		.success(function(data) {

			// when all the users come back, remove the processing variable
			self.processing = false;

			// bind the users that come back to self.users
			self.users = data;
		});

	// function to delete a user
	self.deleteUser = function(id) {
		self.processing = true;

		User.delete(id)
			.success(function(data) {

				// get all users to update the table
				// you can also set up your api
				// to return the list of users with the delete call
				User.all()
					.success(function(data) {
						self.processing = false;
						self.users = data;
					});

			});
	};

})

// controller applied to user creation page
.controller('userCreateController', function(User) {

	var self = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	self.type = 'create';

	// function to create a user
	self.saveUser = function() {
		self.processing = true;
		self.message = '';

		// use the create function in the userService
		User.create(self.userData)
			.success(function(data) {
				self.processing = false;
				self.userData = {};
				self.message = data.message;
			});

	};

})

// controller applied to user edit page
.controller('userEditController', function($routeParams, User) {

	var self = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	self.type = 'edit';

	// get the user data for the user you want to edit
	// $routeParams is the way we grab data from the URL
	User.get($routeParams.user_id)
		.success(function(data) {
			self.userData = data;
		});

	// function to save the user
	self.saveUser = function() {
		self.processing = true;
		self.message = '';

		// call the userService function to update
		User.update($routeParams.user_id, self.userData)
			.success(function(data) {
				self.processing = false;

				// clear the form
				self.userData = {};

				// bind the message from our API to self.message
				self.message = data.message;
			});
	};

});

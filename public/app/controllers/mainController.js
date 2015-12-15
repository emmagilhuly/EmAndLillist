angular.module('mainCtrl', ['authService'])

.controller('mainController', function($rootScope, $location, Auth){
	var self = this

	//get info if a person is logged in
	self.loggedIn = Auth.isLoggedIn()

	//check to see if a user is logged in on every request
	$rootScope.$on('$routeChangeStart', function(){
		self.loggedIn = Auth.isLoggedIn()
	})

	//get user info on page load
	Auth.getUser()
		.then(function(data){
			self.user = data
		})

	//function to handle login form
	self.doLogin = function(){
		//call the Auth.login() function
		Auth.login(self.loginData.username, self.loginData.password)
		.success(function(data){
			//get user info after loggin in
			Auth.getUser()
				.then(function(data){
					self.user = data.data
				})
			//if a user successfully logs in, redirect to users page
			$location.path('/users')
		})
	}

	//function to handle logging out
	self.doLogout = function(){
		Auth.logout()
		$location.path('/')
	}
})








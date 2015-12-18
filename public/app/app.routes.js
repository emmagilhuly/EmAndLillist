angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'app/views/pages/home.html',
			controller: 'itemController',
			controllerAs: 'item'
		})

		// login page
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
   			controller  : 'mainController',
    			controllerAs: 'login'
		})

		// show all users
		.when('/users', {
			templateUrl: 'app/views/pages/users/all.html',
			controller: 'userController',
			controllerAs: 'user'
		})

		// form to create a new user
		// same view as edit page
		.when('/users/create', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userCreateController',
			controllerAs: 'user'
		})

		.when('/signup', {
			templateUrl: 'app/views/pages/signup.html',
			controller: 'userCreateController',
			controllerAs: 'user'
		})

		// page to edit a user
		.when('/users/:user_id', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userEditController',
			controllerAs: 'user'
		})

		// show all items
		.when('/items', {
			templateUrl: 'app/views/pages/items/allItems.html',
			controller: 'itemController',
			controllerAs: 'item'
		})

		// form to create a new item
		.when('/items/create', {
			templateUrl: 'app/views/pages/items/new.html',
			controller: 'itemCreateController',
			controllerAs: 'item'
		})

		// page to edit a item
		.when('/items/:item_id', {
			templateUrl: 'app/views/pages/items/new.html',
			controller: 'itemEditController',
			controllerAs: 'item'
		});


	$locationProvider.html5Mode(true);

});

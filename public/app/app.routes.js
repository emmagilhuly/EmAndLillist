// Angular routes
// inject ngRoute for all of our routing needs
angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'app/views/pages/allItems.html',
			controller: 'itemController',
			controllerAs: 'item'
		})

		// login page
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
   		controller  : 'mainController',
    	controllerAs: 'login'
		})

		.when('/signup', {
			templateUrl: 'app/views/pages/signup.html',
			controller: 'userCreateController',
			controllerAs: 'user'
		})

		// form to create a new user, same view as edit page
		.when('/users/create', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userCreateController',
			controllerAs: 'user'
		})

		// show all users
		.when('/users', {
			templateUrl: 'app/views/pages/users/all.html',
			controller: 'userController',
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
			templateUrl: 'app/views/pages/items/home.html',
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
		})

		.when('/checkout', {
			templateUrl: 'app/views/pages/checkout.html',
			controller: 'itemCtrl',
			controllerAs: 'item'
		})

		// page to edit a item
		.when('/contact', {
			templateUrl: 'app/views/pages/contact.html',
			controller: 'itemCtrl',
			controllerAs: 'item'
		});

	$locationProvider.html5Mode(true);

});

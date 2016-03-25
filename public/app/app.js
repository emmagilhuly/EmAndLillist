// Main module, Angular code

angular.module('EmAndLilApp', [
	'ngAnimate',
	'app.routes',
	'authService',
	'mainCtrl',
	'userCtrl',
	'userService',
	'itemCtrl',
	'itemService'
])

// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');

});

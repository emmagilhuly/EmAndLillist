angular.module('emAndLilApp', ['ngAnimate', 'appRoutes', 'authService', 'mainCtrl', 'userCtrl', 'itemCtrl', 'userService', 'itemService'])

//application config to integrate token into request
.config(function($httpProvider){

  //attach our auth interceptor to the http requests
  $httpProvider.interceptors.push('AuthInterceptor');
})

angular.module('emAndLilApp', ['ngAnimate', 'app.routes', 'authService', 'mainCtrl', 'userCtrl', 'userService'])

//application config to integrate token into request
.config(function($httpProvider){

  //attach our auth interceptor to the http requests
  $httpProvider.interceptors.push('AuthInterceptor');
})

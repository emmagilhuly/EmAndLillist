angular.module('authService', [])

//auth factory to login and get info
//inject $http for communicating with api
//inject $q to return promise objects
//inject authToken to manage tokens

.factory('Auth', function ($http, $q, AuthToken){
  //create auth factory object
  var authFactory = {};

  //log in a user


  //logout

  //check if a user is logged in

  // get user info

  //return auth factory object
  return authFactory;
})

//factory for handling tokens
//inject $window to store token client-side
.factory('AuthToken', function($window){
  var authTokenFactory = {};

  //get the token out of local storage
  authTokenFactory.getToken = function(){
    return $window.localStorage.getItem('token')
  }

  //function to set token or clear token
  //if a token is passed, set the token
  //if there is no token, clear it from local storage
  authTokenFactory.setToken = function(token){
    if (token)
      $window.localStorage.setItem('token', token);
    else {
      $window.localStorage.removeItem('token');
    }

  // set the token or clear the token
  return authTokenFactory;

})

.factory('AuthInterceptor', function ($q, AuthToken){
  var interceptorFactory = {}

  //attach the token to every request

  //redirect if a token doesn't authenticate

  return interceptorFactory;
})

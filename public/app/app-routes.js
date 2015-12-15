//inject ngRoute for all our routing needs
angular.module('appRoutes', ['ngRoute'])

//configure our routes
.config(function($routeProvider, $locationProvider){
  $routeProvider

  //route for the home page
  .when('/', {
    templateUrl: 'app/views/pages/home.html'
  })

//get rid of the hash in the URL
$locationProvider.html5Mode(true);

})

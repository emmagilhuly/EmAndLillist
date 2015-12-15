angular.module('itemService', [])

.factory('Item', function($http){
	//create the object
	var itemFactory = {}

	//a function to get all the items
	itemFactory.all = function(){
		return $http.get('/api/items')
	}
	return itemFactory
})


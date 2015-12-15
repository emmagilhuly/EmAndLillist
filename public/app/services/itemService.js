angular.module('itemService', [])

.factory('Item', function($http){
	//create the object
	var itemFactory = {}

	//get a single item
	itemFactory.get = function(id) {
		return $http.get('/api/items/' + id)
	}

	//a function to get all the items
	itemFactory.all = function(){
		return $http.get('/api/items')
	}

	//create a item
	itemFactory.create = function(itemDatat) {
		return $http.post('/api/items/', itemData)
	}

	//update a item
	itemFactory.update = function(id, itemData) {
		return $http.put('/api/items/' + id, itemData)
	}

	//delete a item
	itemFactory.delete = function(id){
		return $http.delete('/api/items/' + id)
	}

	//return entire itemFactory object
	return itemFactory
})

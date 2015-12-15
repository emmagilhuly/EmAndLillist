//inject the item service into our main Angular module
angular.module('itemCtrl', ['itemService'])

//create a controller and inject the Item factory
.controller('itemController', function(Item){
	var self = this
	//get all the items
	Item.all()
		//promise object
		.success(function(data){
			//bind the data to a controller variable, this is from itemService
			self.item = data;
		})
})
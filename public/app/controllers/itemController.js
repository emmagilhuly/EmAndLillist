//inject the item service into our main Angular module
angular.module('itemCtrl', ['itemService'])

//create a controller and inject the Item factory
.controller('itemController', function(Item){
	var self = this

	//set a processing variable to show loading things
	self.processing = true;

	//get all the items
	Item.all()
		//promise object
		.success(function(data){
			//when all the users come back, remove processing variable
			self.processing = false
			//bind the data to a controller variable, this is from itemService
			self.item = data;
		})
})

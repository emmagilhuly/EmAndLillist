angular.module('emAndLilApp', [])

.controller('mainController', function(){
	//bind this to self
	var self = this

	//define variables and objects on this so it's available to views
	//define a basic variable
	self.message = 'hey come and see how good i look'
	//define a list of items
	self.items = [
		{name: 'macbook pro', color: 'silver', price: 1000},
		{name: 'imac', color: 'silver', price: 1500},
		{name: 'macbook air', color: 'black', price: 500}
	]
})


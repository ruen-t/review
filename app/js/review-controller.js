angular.module('review', ['datatables', 'ngResource'])
.controller('ReviewController', ReviewController);

function ReviewController($resource) {
    var vm = this;
   /* $.get( "http://172.16.252.110/reviewtoolapi/review/simple/", function( data ) {
  		vm.review = data;
  		console.log(vm.review);
  	
	});*/
    $resource('all.json').query().$promise.then(function(project) {
      // console.log(project);  
      vm.project = project;
    });
}

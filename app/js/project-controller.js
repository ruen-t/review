
var ProjectController =['$resource','$translate', function ($resource,$translate) {
    var vm = this;
    vm.message = "hello this is a project page"
   
   
}]
angular.module('project', ['datatables', 'ngResource'])
.controller('ProjectController', ProjectController);






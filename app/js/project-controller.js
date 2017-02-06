angular.module('project', ['datatables', 'ngResource'])
.controller('ProjectController', ProjectController);

function ProjectController($resource) {
    var vm = this;
    vm.message = "hello this is a project page"
    
}

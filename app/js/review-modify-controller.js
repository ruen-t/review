
var ReviewModifyController =['$resource','$translate', function ($resource,$translate) {
    var vm = this;
    vm.message = "hello this is a add page"
   
   
}]
angular.module('reviewmodify', ['datatables', 'ngResource'])
.controller('ReviewModifyController', ReviewModifyController);






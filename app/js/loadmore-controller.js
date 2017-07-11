angular.module('review', [ ])
.controller('LoadMoreController', LoadMoreController);

function LoadMoreController ($mdDialog,$location,$rootScope) {
	var vm = this;
  
   vm.loadData = loadData;
   vm.cancel = cancel;
   vm.startDateParam = new Date();
   vm.endDateParam = new Date();
   function loadData(){
      
      var startDate = new Date(vm.startDateParam)
      var endDate = new Date(vm.endDateParam)
      var start_date_str = toJSONLocal(startDate);
      var end_date_str = toJSONLocal(endDate);
      console.log(start_date_str)
      console.log(end_date_str)
       $location.path( "/review/"+start_date_str+"/"+end_date_str);
      $mdDialog.hide();
   }
   function cancel(){
      $mdDialog.hide();
   }
   function toJSONLocal (date) {
     var local = new Date(date);
     local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
     return local.toJSON().slice(0, 10);
   }
	
}

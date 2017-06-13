angular.module('manual', [ 'ngResource'])
.controller('ManualController', ManualController);

function ManualController ($resource,$translate,$rootScope) {
   var vm = this;
   vm.isEnglish = false;
   $rootScope.$on("english",function(){
         //console.log("hello english")
         vm.isEnglish=true;
   });
   $rootScope.$on("japanese",function(){
         //console.log("hello japanese");
         vm.isEnglish = false;
   });
}
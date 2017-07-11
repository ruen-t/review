angular.module('history', [])
.controller('HistoryController', HistoryController);

function HistoryController ($translate,$rootScope) {
	var vm = this;
	vm.isEnglish = true;
   $rootScope.$on("english",function(){
   		//console.log("hello english")
   		vm.isEnglish=true;
   });
	$rootScope.$on("japanese",function(){
   		//console.log("hello japanese");
   		vm.isEnglish = false;
   });

   vm.team = [
      {name:"Marc Ericson Chavez Santos",email:"santos@wni.com",img:"assets/1806.jpg"},
      {name:"Naldo Sancho Liman",email:"liman@wni.com",img:"assets/1769.jpg"},
      {name:"Angela Puspitasari",email:"puspit@wni.com",img:"assets/1680.jpg"},
      {name:"Ayako Yagi",email:"yagi-a@wni.com",img:"assets/1800.jpg"},
      {name:"Masahiro Hirano",email:"hirano@wni.com",img:"assets/1794.jpg"},
      {name:"Tanapat Ruengsatra",email:"ruen-t@wni.com",img:"assets/1821.jpg"},


   ]
}
var project = {
  id: '456',
  title: 'TCDRT',
  startdate: new Date(),
  enddate: new Date(),
  members: '',
  reviewers: '',
  shop: ''
}

var projects = [
  {id:'',shop:'',title:'',startdate:'',enddate:'',members:[],reviewers:[]},
];

var reviews = [
  {id:'123',project_id:'',date: new Date(),minutes:'',location:'',comment:''},
]

var employees = [
  {id:'20',structural_pos:'gl',name:'angela',email:'puspit@wni.com'}
]

var types = ('PSR RR CDR').split(' ').map(function(types){
  return {abbrev: types};
});

var revTypes = [
  {id:'',code:'',name_en:'',name_jp:''},
];

var shops = [
  {id:'',code:'',name_en:'',name_jp:''},
];

var levels = ('PM PDM DEV').split(' ').map(function(levels){
  return {abbrev: levels};
});

var roles = [
  {id:'',code:'',name_en:'',name_jp:''},
];

var reviewers = [
  {id:1,name:"test1",levels:0 },
];

var members = [
  {id:1,name:"test",levels:0 },
];

var places = [
  {id:'',code:'',name_en:'',name_jp:''},
];

var ReviewModifyController =['$resource','$translate',"$http", function ($resource,$translate,$http) {
  var vm = this;
  vm.message = "hello this is a add page";
  vm.types = types;
  vm.shops = shops;
  vm.levels = levels;
  vm.reviewers = reviewers;
  vm.addProjectMember = addProjectMember;
  vm.addReviewerMember = addReviewerMember;
  vm.project = project;
  vm.projects = projects;
  vm.reviews = reviews;
  vm.employees = employees;
  vm.places = places;
  vm.revTypes = revTypes;
  vm.fetchMember = fetchMember;
  vm.fetchShops = fetchShops;
  vm.fetchPlace = fetchPlace;
  vm.fetchRevType = fetchRevType;
  vm.fetchRole = fetchRole;
  vm.fetchProject = fetchProject;

  vm.fetchMember();
  vm.fetchShops();
  vm.fetchPlace();
  vm.fetchRevType();
  vm.fetchRole();
  vm.fetchProject();

  function addProjectMember (){
   vm.members.push({id:-1,name:"angela",levels:0 });
  }

  function addReviewerMember (){
   vm.reviewers.push({id:-1,name:"angela",levels:0 });
  }

  function fetchMember(){
    $http({
      method: 'GET',
      url:  "http://172.16.252.110/reviewtoolapi/employee/",
      //data:$.param({control_op:0}),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      if(response.data){
        var data = response.data;
        console.log(data);
        vm.employees = [];
        for (i in data ){
          vm.employees.push({id:i,structural_pos:data[i].employee_rank,name:data[i].employee_name,email:data[i].employee_email});
        }
      }
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
   }

  function fetchShops(){
    $http({
      method: 'GET',
      url:  "http://172.16.252.110/reviewtoolapi/master/Shop/",
      //data:$.param({control_op:0}),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      //console.log(response);
      
      if(response.data){
        var data = response.data;
        console.log(data);
        vm.shops = [];
        for (i in data ){
         vm.shops.push({id:i,code:data[i].shop_code,name_en:data[i].shop_name_en,name_jp:data[i].shop_name_jp});
        }
      }
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }

  function fetchPlace(){
    $http({
      method: 'GET',
      url:  "http://172.16.252.110/reviewtoolapi/master/MeetSpace/",
      //data:$.param({control_op:0}),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      //console.log(response);
      
      if(response.data){
        var data = response.data;
        console.log(data);
        vm.places = [];
        for (i in data ){
         vm.places.push({id:i,code:data[i].meetspace_code,name_en:data[i].meetspace_name_en,name_jp:data[i].meetspace_name_jp});
        }
      }
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }

  function fetchRevType(){
    $http({
      method: 'GET',
      url:  "http://172.16.252.110/reviewtoolapi/master/RevType/",
      //data:$.param({control_op:0}),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      //console.log(response);
      
      if(response.data){
        var data = response.data;
        console.log(data);
        vm.revTypes = [];
        for (i in data ){
         vm.revTypes.push({id:i,code:data[i].revtype_code,name_en:data[i].revtype_name_en,name_jp:data[i].revtype_name_jp});
        }
      }
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }

  function fetchRole(){
    $http({
      method: 'GET',
      url:  "http://172.16.252.110/reviewtoolapi/master/Role/",
      //data:$.param({control_op:0}),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      //console.log(response);
      
      if(response.data){
        var data = response.data;
        console.log(data);
        // vm.places = [];
        // for (i in data ){
        //  vm.places.push({id:i,code:data[i].meetspace_code,name_en:data[i].meetspace_name_en,name_jp:data[i].meetspace_name_jp});
        // }
      }
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }

  function fetchProject(){
    $http({
      method: 'GET',
      url:  "http://172.16.252.110/reviewtoolapi/project/",
      //data:$.param({control_op:0}),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      //console.log(response);
      
      if(response.data){
        var data = response.data;
        console.log(data);
        // vm.projects = [];
        // for (i in data ){
        //  vm.projects.push({id:i,code:data[i].meetspace_code,name_en:data[i].meetspace_name_en,name_jp:data[i].meetspace_name_jp});
        // }
      }
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }

  function removeProjectMember (id){
    var index = -1;   
    var comArr = eval( vm.reviewers );
    for( var i = 0; i < comArr.length; i++ ) {
      if( comArr[i].id=== id ) {
        index = i;
        break;
      }
    }
    if( index === -1 ) {
      alert( "Something gone wrong" );
    }
    vm.reviewers.splice( index, 1 );  
  }

  function generateId(){}

}]

 angular.module('reviewmodify', ['datatables', 'ngResource'])
.controller('ReviewModifyController', ReviewModifyController)
.config(function($mdThemingProvider) {

    // Configure a dark theme with primary foreground yellow

    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();

  });





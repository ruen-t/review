


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
  {id:2,name:"test2",levels:0 },
];
var documents = [
  {title:"",type:1,url:"" },
  {title:"",type:2,url:"" },
];

var members = [
  {id:1,name:"test",levels:0 },
];

var places = [
  {id:'',code:'',name_en:'',name_jp:''},
];
var selectedProject ={
  id:-1,project_name:"-------",shop:{id:17,shop_code:"NOCODE",shop_name_en:"---------",shop_name_jp:"---------"}
}

var ReviewModifyController =['$scope','$resource','$translate',"$http", function ($scope,$resource,$translate,$http) {
  var vm = this;
  vm.message = "hello this is a add page";


  vm.reviewers = reviewers;
  vm.members = members;
  vm.places = places;
  vm.selectedProject = selectedProject;
  vm.projectSelected = false;
  vm.developments = [];
  vm.selectedDevelopmentID =-1;
  vm.documentTypes =[];
  vm.documents = documents;

  vm.addReviewMember = addReviewMember;
  vm.projects =[];
  vm.projectManager=[];
  vm.reviews = reviews;
  vm.employees = employees;
  vm.places = places;
  vm.revTypes = revTypes;
  vm.fetchMember = fetchMember;
  vm.removeReviewerMember = removeReviewerMember;
  vm.fetchProject = fetchProject;
  vm.saveButtonClick = saveButtonClick;
  vm.addDocument = addDocument;
  vm.removeDocument = removeDocument;
  

 $scope.$watch("vm.selectedProject.id",function(newValue,oldValue){
   if(vm.selectedProject.id>0){
    vm.projectSelected = true;
    vm.selectedDevelopmentID=-1;
   changeShop();
   //fetchProjectMember();
   fetchDevelopment();
 }
  
 })
 
  



  vm.fetchMember();
  fetchProject();

   fetchPlace();
   fetchReviewType();
   fetchRole();
  //vm.fetchProject();
  fetchDocumentType();
  function saveButtonClick(){
    /*
    {
    "review_location": "1",
    "review_date": "2017-8-20T3:1",
    "development": "1",
    "review_type": "2",
    "review_comment": "This is API test.",
    "reviewmember_set": [
         {
            "employee": "3",
              "role": "1"
          }
      ]
    }
    */
    //console.log(vm.projectID);
    console.log(vm.selectedPlace);
    vm.selectedType
    vm.selectedDate

  }
  function addDocument(){
    console.log("add documents")
    vm.documents.reverse();
   vm.documents.push({title:"",type:-1,url:"" });
   vm.documents.reverse();

  }
  function removeDocument(index){
    vm.documents.splice(index,1)
  }
  function fetchDocumentType(){
    fetchData(getDocumentTypeAPI,"documentTypes")
  }
  function fetchDevelopment(){
    var projectID = vm.selectedProject.id;
    fetchData(getDevelopmentAPI+projectID,"developments")
    
  }
  function removeReviewerMember(id){
    console.log(id);
    for (var i =0;i<vm.reviewers.length;i++){
      if(vm.reviewers[i].id==id)vm.reviewers.splice(i,1);
    }
  }
  function fetchProjectMember (){
    $http({
      method: 'GET',
      url:  getProjectMemberAPI+vm.selectedProject.id,
      //data:$.param({control_op:0}),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      if(response.data){

        var data = response.data;

        if(data.length>0){
           vm.projectManager = data;
         // console.log(data)
          vm.projectSelected = true;
        }else{
          vm.projectSelected = false;
        }
       
      }
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      vm.projectSelected=false;
    });
  }
  function changeShop(){
   // console.log("changeShop")
   for(var i =0;i< vm.projects.length;i++){

    //console.log("Project i:"+vm.projects[i].id)
    //console.log("selectedProject:"+vm.selectedProject.id)
    if(vm.projects[i].id == vm.selectedProject.id){
      //console.log("in if")
      vm.selectedProject.shop = vm.projects[i].shop;
      break;
    }
   }
  }
  function addReviewMember (){
    console.log("add reviewers")
    vm.reviewers.reverse();
   vm.reviewers.push({id:-1,name:"",levels:-1 });
   vm.reviewers.reverse();
  }

  function fetchMember(){
    fetchData(getEmployeeAPI,"employees")
   }

  
  function fetchData(url,arrayname){
    $http({
      method: 'GET',
      url:  url,
      //data:$.param({control_op:0}),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(function successCallback(response) {
 
      if(response.data){
        array =[]
        var data = response.data;
        vm[arrayname]= data;
       // console.log(data)

      }
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });

  }
  function fetchPlace(){
    fetchData(getMeetingSpaceAPI,"places");
  }

  function fetchReviewType(){
     fetchData(getReviewTypeAPI,"revTypes");
  }

  function fetchRole(){
     fetchData(getRoleAPI,"roles");
  }

  function fetchProject(){
    fetchData(getProjectListAPI,"projects")
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





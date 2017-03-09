


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
  {employee:-1,role:-1 },
 /* {id:2,role:2 },*/
];
var documents = [
  {title:"",type:-1,url:"" },
  
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

var ReviewModifyController =['$routeParams','$location','$scope','$resource','$translate',"$http", function ($routeParams,$location,$scope,$resource,$translate,$http) {
  var vm = this;
   vm.state =0; //0 -> add, 1-> edit
  vm.editId = $routeParams.id;
  console.log(vm.editId)

    vm.reviewers =reviewers;
    vm.members = members;
    vm.places = places;
    vm.selectedProject = selectedProject;
    vm.projectSelected = false;
    vm.developments = [];
    vm.selectedDevelopmentID =-1;
    vm.documentTypes =[];
    vm.documents = documents;
    vm.startDate = new Date();
    vm.endDate = new Date();
    vm.editReview ={};
  if(!vm.editId){
    vm.state=0;

  }else{
    vm.state=1;
    $http({
      method: 'GET',
      url:  getSpecificReviewAPI+vm.editId,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(function successCallback(response) {
 
      if(response.data){
        var data = response.data[0];
        console.log(data)
        vm.projectSelected = true;
        vm.reviewTitle =data.review_title;
        vm.selectedPlace = data.review_location.id;
        vm.startDate = new Date(data.review_date_start);
        vm.endDate = new Date(data.review_date_end);
        vm.selectedDevelopmentID=data.development.id;
        vm.selectedProject = data.project;
        vm.selectedType = data.review_type.id;
        vm.comment = data.review_comment;
        vm.reviewers =[];
        for(i in data.reviewmember_set){
          var reviewer = data.reviewmember_set[i];
          vm.reviewers.push({employee:reviewer.employee.id,role:reviewer.role.id});
        }
      }
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
    $http({
      method: 'GET',
      url:  getReviewDocumentAPI+vm.editId,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(function successCallback(response) {
 
      if(response.data){
       console.log(response.data);
       var data = response.data;
       for(i in data){
        vm.documents.push({url:data[i].document_url,title:data[i].document_title,type:data[i].document_type});
       }

      }
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });

  }




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
  vm.editButtonClick = editButtonClick;
  

 $scope.$watch("vm.selectedProject.id",function(newValue,oldValue){
   if(vm.selectedProject.id>0){
    vm.projectSelected = true;
   if(vm.state==0) vm.selectedDevelopmentID=-1;
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
  function editButtonClick(){
    vm.reviewers.forEach(function(v){ delete v.$$hashKey; delete v.object });
    var start_date = new Date(vm.startDate).toJSON();
    var end_date = new Date(vm.endDate).toJSON();
    var json = {review_title:vm.reviewTitle,review_location:vm.selectedPlace,review_date_start: start_date,review_date_end: end_date,development:vm.selectedDevelopmentID,review_type:vm.selectedType,review_comment:vm.comment,reviewmember_set:vm.reviewers}
    var json_str =JSON.stringify(json);
    console.log(json_str)
    $http({
      method: 'PUT',
      url:  editReviewAPI+vm.editId+"/",
      data:json_str,
      headers: { 'Content-Type': 'application/json' }
    }).then(function successCallback(response) {
 
       if(response.data){
          console.log(response.data)
         }
         

       });

  }
  function saveButtonClick(){
   
    //console.log(vm.projectID);
    vm.reviewers.forEach(function(v){ delete v.$$hashKey; delete v.object });
    var start_date = new Date(vm.startDate).toJSON();
    var end_date = new Date(vm.endDate).toJSON();
    var json = {review_title:vm.reviewTitle,review_location:vm.selectedPlace,review_date_start: start_date,review_date_end: end_date,development:vm.selectedDevelopmentID,review_type:vm.selectedType,review_comment:vm.comment,reviewmember_set:vm.reviewers}
    var json_str =JSON.stringify(json);
    console.log(json_str)
    $http({
      method: 'POST',
      url:  addReviewAPI,
      data:json_str,
      headers: { 'Content-Type': 'application/json' }
    }).then(function successCallback(response) {
 
       if(response.data){
         var createdID = response.data.id;
         for(var i = 0;i<vm.documents.length;i++){
          var doc = {document_url:vm.documents[i].url,document_type:vm.documents[i].type,document_title:vm.documents[i].title,review:createdID};
          var json_doc = JSON.stringify(doc);
          console.log(json_doc)
          submitDucument(json_doc);
         
         }
          $location.path( "/review" );
          swal(
            'New Review Added',
            '',
            'success'
          ).then(function(){
              //$location.path( "/" );
          });
       

       }

      
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
    console.log(vm.documents)
   

  }

  function submitDucument(data){
    $http({
      method: 'POST',
      url:  addDocumentAPI,
      data:data,
      headers: { 'Content-Type': 'application/json' }
    }).then(function successCallback(response) {
        console.log(response)
      
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
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
  function removeReviewerMember(index){
   /* for (var i =0;i<vm.reviewers.length;i++){
      if(vm.reviewers[i].id==id)vm.reviewers.splice(i,1);
    }*/
     vm.reviewers.splice(index,1)

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
   vm.reviewers.push({employee:-1,role:-1 });
   vm.reviewers.reverse();
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
  function fetchMember(){
    fetchData(getEmployeeAPI,"employees")
   }
  function fetchPlace(){
    fetchData(getMeetingSpaceAPI,"places");
  }

  function fetchReviewType(){
     fetchData(getReviewTypeAPI,"revTypes");
  }
  function fetchProjectMember (){
    fetchData(getProjectMemberAPI+vm.selectedProject.id,"projectManager");
  }
  function fetchRole(){
     fetchData(getRoleAPI,"roles");
  }

  function fetchProject(){
    fetchData(getProjectListAPI,"projects")
  }
 
  

}

]

 angular.module('reviewmodify', ['datatables', 'ngResource'])
.controller('ReviewModifyController', ReviewModifyController)
.config(function($mdThemingProvider) {

    // Configure a dark theme with primary foreground yellow

    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();

  })
.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.post['token'] = 'hh1hs6ZsUxllaxk16gaptrcAFRlDEKf8qrWenyiYVpPugdE7gOwUhJ6apnaRebnT';
}]);





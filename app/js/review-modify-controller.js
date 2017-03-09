


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

var ReviewModifyController =['$location','$scope','$resource','$translate',"$http", function ($location,$scope,$resource,$translate,$http) {
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
  vm.startDate = new Date();
  vm.endDate = new Date();


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
  "development": "string", (Development Code) -> I guess we don’t need to ask for “shop” because it will be derived from the Development Code, such that Development Code -> development(id) -> shop(id) -> shop name en
  "review_comment": "string",  (Comment)
  "reviewmember_set": [ (Name?, Email, Role)
    "string" 
  ],
  "review_date_end": "string", (End)
  "review_type": "string", (PSR, CDR, RR, etc)
  "review_date_start": "string", (Start)
  "review_location": "string", (Place)
  "review_title": "string" (user given title)
}
    
{
  
  "document_url": "string",
  "active": true,
  "document_type": "string",
  "review": "string",
  "document_title": "string"

}

    */ swal(
            'New Review Added',
            '',
            'success'
          ).then(function(){

              $location.path( "/review" );
              console.log("reload")
          });
       return;
   
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
          var doc = {document_url:documents[i].url,document_type:documents[i].type,document_title:documents[i].title,review:createdID};
          var json_doc = JSON.stringify(doc);
          console.log(json_doc)
          submitDucument(json_doc);
         
         }
          swal(
            'New Review Added',
            '',
            'success'
          ).then(function(){
              $location.path( "/" );
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





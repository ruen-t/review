


var reviews = [
  {id:'123',project_id:'',date: new Date(),minutes:'',location:'',comment:''},
]

var employees = [
  {id:'20',structural_pos:'gl',employee_name:'angela',email:'puspit@wni.com'}
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
  {update:true,employee:[],role:-1 },
 /* {id:2,role:2 },*/
];
var documents = [
  {update:true,title:"",type:-1,url:"" },
  
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

var ReviewModifyController =['$routeParams','$location','$scope','$resource','$translate',"$http","$log","$timeout", "$q", function ($routeParams,$location,$scope,$resource,$translate,$http,$log,$timeout, $q) {
  var vm = this;
  var token = getCookie("token_django");
  if(!token){
    if($routeParams.id){
      $location.path( "/login/2/"+$routeParams.id);
       return;
    }else{
      $location.path( "/login/1");
       return;
    }
       
 }
    var token_str = 'Bearer '+token;
    vm.token_str= token_str;
   vm.state =0; //0 -> add, 1-> edit
  vm.editId = $routeParams.id;
  console.log(vm.editId)

    vm.reviewers = [
  {update:true,employee:[],role:-1 },
 /* {id:2,role:2 },*/
];
    vm.members = members;
    vm.places = places;
    vm.selectedProject = selectedProject;
    vm.projectSelected = false;
    vm.developments = [];
    vm.selectedDevelopmentID =-1;
    vm.documentTypes =[];
    vm.documents = [{update:true,title:"",type:-1,url:"" }];
    vm.startDate = new Date();
    vm.endDate = new Date();
    vm.editReview ={};
    vm.document_deleteQueue=[];
    vm.reviewer_deleteQueue=[];
     

  
  if(!vm.editId){
    vm.state=0;
    var d = new Date();
    var date_str = d.toDateString()
    console.log(d.toDateString())
    $('#startdate').datetimepicker({
      defaultDate:date_str
    });
      $('#enddate').datetimepicker({
         useCurrent: false ,//Important! See issue #1075
         defaultDate:date_str

    });
                    $("#startdate").on("dp.change", function (e) {

                        $('#enddate').data("DateTimePicker").minDate(e.date);
                      
                       
                    });
                    $("#enddate").on("dp.change", function (e) {
                        $('#startdate').data("DateTimePicker").maxDate(e.date);
           
           
        });
  fetchShop();
  fetchProject();

  }else{
    vm.state=1;
    $http({
      method: 'GET',
      url:  getSpecificReviewAPI+vm.editId,
      headers: { 'Content-Type': 'application/json',
                 'Accept': 'application/json' ,
                 'Authorization': vm.token_str }
    }).then(function successCallback(response) {
 
      if(response.data){
        var data = response.data[0];
        //console.log(response);
        console.log(data)

        vm.projectSelected = true;
        vm.reviewTitle =data.review_title;
        vm.selectedPlace = data.review_location;
        vm.startDate = new Date(data.review_date_start);
        vm.endDate = new Date(data.review_date_end);
        vm.selectedDevelopmentID=data.development;

        $('#startdate').datetimepicker({
           defaultDate: data.review_date_start
        });
        $('#enddate').datetimepicker({
          defaultDate: data.review_date_end,
            useCurrent: false //Important! See issue #1075
        });
        $("#startdate").on("dp.change", function (e) {

            $('#enddate').data("DateTimePicker").minDate(e.date);
          // vm.startDate=  $("#startdate").data("datetimepicker").getDate();
           
        });
        $("#enddate").on("dp.change", function (e) {
            $('#startdate').data("DateTimePicker").maxDate(e.date);
           // vm.endDate =  $("#enddate").data("datetimepicker").getDate();
           
        });

       /* for(i =0;i< data.reviewmember_set.length;i++){
          callAPI(getEmployeeByIDAPI+data.reviewmember_set[i].employee,"GET",function(response){
            var employee_data = response.data[0];
            console.log(employee_data);
            vm.reviewers.push({employee_data})
          })

        }*/

        

        callAPI(getDevelopmentIDAPI+data.development,"GET",function(response){
          //console.log(response.data[0]);
          var development_data = response.data[0];
          var project_id = development_data.project;
          vm.selectedProject.id = project_id;
          callAPI(getProjectByIDAPI+project_id,"GET",function(response){
            let project_data = response.data[0];
            vm.project = {};
            
            fetchDataWithCallBack(getProjectListAPI,function(response){
               if(response.data){
                  array =[]
                  var data = response.data;
                  vm["projects"]= data;
                  vm.project.projectObj = project_data;
                }
             })
           
            
            vm.selectedProject.project_name =project_data.project_name;
            vm.selectedProject.shop.id = project_data.shop;
            callAPI(getShopByIDAPI+project_data.shop,"GET",function(response){
              var shop_data = response.data[0];
              vm.selectedProject.shop = shop_data;
              vm.shop ={};
              fetchDataWithCallBack(getShopAPI,function(response){
               if(response.data){
                  array =[]
                  var data = response.data;
                  vm["shops"]= data;
                 vm.shop.shopObj = shop_data;
                }
             })
              
              
              vm.selectedShopID = shop_data.id;


            })
          })
        })
        vm.selectedProject.id = data.project;
        vm.selectedType = data.review_type;
        vm.comment = data.review_comment;
        vm.reviewers =[];
        for(i in data.reviewmember_set){
          var reviewer = data.reviewmember_set[i];

          vm.reviewers.push({id:data.reviewmember_set[i].id,update:false,employee:reviewer.employee,role:reviewer.role});
        }
        fetchDataWithCallBack(getEmployeeAPI,function (response){
          //console.log(response);
           if(response.data){
            vm.employees = response.data;
              for (i in vm.reviewers){
                  for(j in vm.employees){
                    if(vm.reviewers[i].employee==vm.employees[j].id){
                      vm.reviewers[i].employeeObj = vm.employees[j];
                      continue;
                    }
                  }
              }
             // console.log(vm.reviewers);
           }
            
        });
        
        console.log("reviewers")
        console.log(vm.reviewers);
      }
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
    $http({
      method: 'GET',
      url:  getReviewDocumentAPI+vm.editId,
      headers: { 'Content-Type': 'application/json',
                  'Accept': 'application/json' ,
                  'Authorization': vm.token_str 
    }
    }).then(function successCallback(response) {
      console.log("GET documents")
      console.log(response)
 
      if(response.data){
       console.log(response.data);
       var data = response.data;
       vm.documents=[];
       for(i in data){
        //document.update 0->add 1->nothing 2->delete
        vm.documents.push({id:data[i].id,update:false,url:data[i].document_url,title:data[i].document_title,type:data[i].document_type});
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
  vm.validateTitle = validateTitle;
  vm.validateTitleObj = {pattern:false,required:false};
  
$scope.$watch("vm.selectedShopID",function(newValue,oldValue){
   if(vm.selectedShopID>0){
    vm.shopSelected = true;
   
     fetchProjectByShop(vm.selectedShopID);
    // console.log("Fetch Project")
   }
  
 })
$scope.$watch("vm.reviewTitle",function(newValue,oldValue){
    //console.log(vm.reviewTitle.$error);
    validateTitle();
 })
 $scope.$watch("vm.selectedProject.id",function(newValue,oldValue){
   if(vm.selectedProject.id>0){
    vm.projectSelected = true;
   if(vm.state==0) vm.selectedDevelopmentID=-1;
    //changeShop();
   //fetchProjectMember();
    fetchDevelopment();
   }
  
 })
 
  



  //vm.fetchMember();
  

   fetchPlace();
   fetchReviewType();
   fetchRole();
  
  fetchDocumentType();

  function callAPI(url,type,callback){
      $http({
      method: type,
      url:  url,
      headers: { 'Content-Type': 'application/json',
                  'Accept': 'application/json' ,
                  'Authorization': vm.token_str 
    }
    }).then(function successCallback(response) {
     
      callback(response);
      
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }
  function editButtonClick(){
    vm.reviewers.forEach(function(v){ delete v.$$hashKey; delete v.object });
    vm.startDate=  $("#startdate").find("input").val();
      vm.endDate=  $("#enddate").find("input").val();
    //console.log(vm.startDate);
   // console.log(vm.endDate);
    var start_date_obj = new Date(vm.startDate);
    var end_date_obj = new Date(vm.endDate)
    //console.log(start_date_obj)
   // console.log(end_date_obj)

    var start_date =new Date(start_date_obj.getTime() - (start_date_obj.getTimezoneOffset() * 60000)).toJSON()
    var end_date =  new Date(end_date_obj.getTime() - (end_date_obj.getTimezoneOffset() * 60000)).toJSON()
    var json = {review_title:vm.reviewTitle,review_location:vm.selectedPlace,review_date_start: start_date,review_date_end: end_date,development:vm.selectedDevelopmentID,review_type:vm.selectedType,review_comment:vm.comment}
    var json_str =JSON.stringify(json);
   // console.log(json_str)
    $http({
      method: 'PATCH',
      url:  editReviewAPI+vm.editId+"/",
      data:json_str,
      headers: { 'Content-Type': 'application/json',
                 'Accept': 'application/json' ,
                 'Authorization': vm.token_str }
    }).then(function successCallback(response) {
 
       if(response.data){
          console.log(response)
           for(var i = 0;i<vm.documents.length;i++){
            if(parseInt(vm.documents[i].type)<0)continue;
            var doc = {document_url:vm.documents[i].url,document_type:vm.documents[i].type,document_title:vm.documents[i].title,review:vm.editId};
            var json_doc = JSON.stringify(doc);
           // console.log(json_doc)
            if(vm.documents[i].update)submitDucument(json_doc); 
         }  
         for (var i =0;i<vm.document_deleteQueue.length;i++){
            deleteDocument(vm.document_deleteQueue[i].id);
          }
          for (var i =0;i<vm.reviewers.length;i++){
            if(!vm.reviewers[i].update||parseInt(vm.reviewers[i].role)<0)continue;
            var data = {review: vm.editId,role: vm.reviewers[i].role,employee:vm.reviewers[i].employee }
            var json_data = JSON.stringify(data);
            requestAddMember(json_data)
         }
         for (var i =0;i<vm.reviewer_deleteQueue.length;i++){
            requestRemoveMember(vm.reviewer_deleteQueue[i].id);
          }
         }
        // $location.path( "/review" );
          swal(
            'Review edited',
            '',
            'success'
          ).then(function(){
              $location.path( "/" );
              $scope.$apply();
          });

       });

  }
  function validateTitle() {
    console.log("validated")
    var re = /^.+(\[NEW\]|\[MAINTE\]|\[VUP\])$/gi;
    if(typeof vm.reviewTitle!= "undefined"){
      vm.validateTitleObj.required=false;
    }else{
       vm.validateTitleObj.required=true;
    }
    vm.validateTitleObj.pattern = !re.test(vm.reviewTitle);
    console.log(vm.reviewTitle)
    console.log(vm.validateTitleObj)
}
  function saveButtonClick(){

   
    //console.log(vm.projectID);
    vm.reviewers.forEach(function(v){ delete v.$$hashKey; delete v.object });
       vm.startDate=  $("#startdate").find("input").val();
      vm.endDate=  $("#enddate").find("input").val();
    //console.log(vm.startDate);
   // console.log(vm.endDate);
    var start_date_obj = new Date(vm.startDate);
    var end_date_obj = new Date(vm.endDate)
    //console.log(start_date_obj)
   // console.log(end_date_obj)

    var start_date =new Date(start_date_obj.getTime() - (start_date_obj.getTimezoneOffset() * 60000)).toJSON()
    var end_date =  new Date(end_date_obj.getTime() - (end_date_obj.getTimezoneOffset() * 60000)).toJSON()
    //console.log(start_date);
   // console.log(end_date)
    var json;
    if(vm.selectedDevelopmentID != -1){
      json = {review_title:vm.reviewTitle,review_location:vm.selectedPlace,review_date_start: start_date,review_date_end: end_date,development:vm.selectedDevelopmentID,review_type:vm.selectedType,review_comment:vm.comment}
    }else
    {
      json = {review_title:vm.reviewTitle,review_location:vm.selectedPlace,review_date_start: start_date,review_date_end: end_date,development:null,review_type:vm.selectedType,review_comment:vm.comment}
    }
    var json_str =JSON.stringify(json);
    console.log(json_str)
    //return ;
    $http({
      method: 'POST',
      url:  addReviewAPI,
      data:json_str,
      headers: { 'Content-Type': 'application/json' ,
                'Accept': 'application/json' ,
                'Authorization': vm.token_str}
    }).then(function successCallback(response) {
      console.log(response)
 
       if(response.data){
         var createdID = response.data.id;
         for(var i = 0;i<vm.documents.length;i++){
           if(parseInt(vm.documents[i].type)<0)continue;
          var doc = {document_url:vm.documents[i].url,document_type:vm.documents[i].type,document_title:vm.documents[i].title,review:createdID};
          var json_doc = JSON.stringify(doc);
          //console.log(json_doc)
          submitDucument(json_doc);
         
         }
         for (var i =0;i<vm.reviewers.length;i++){
          if(!vm.reviewers[i].update||parseInt(vm.reviewers[i].role)<0)continue;
          var data = {review: createdID,role: vm.reviewers[i].role,employee:vm.reviewers[i].employee }
          var json_data = JSON.stringify(data);
          requestAddMember(json_data)
         }
         // $location.path( "/review" );
          swal(
            'New Review Added',
            '',
            'success'
          ).then(function(){
              console.log("change Location");
              $location.path( "/" );
              $scope.$apply()
          });
       

       }

      
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      swal({
        type:'warning',
         title: 'Cannot add',
         html:'<p>Make sure the minimum information is complete:</p><br><p>1. Title</p><br><p>2. Date and Time</p><br></p>3. Review Type</p>'
      }
            
           
            
          ).then(function(){
             // $location.path( "/" );
          });
    });
    console.log(vm.documents)
   

  }
  function requestRemoveMember(id){
     $http({
      method: 'DELETE',
      url:  deleteReviewMemberAPI+id+"/",

      headers: { 'Content-Type': 'application/json',
                 'Accept': 'application/json' ,
                 'Authorization': vm.token_str}
    }).then(function successCallback(response) {
        console.log(response)
      
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }
  function requestAddMember(data){
    console.log("requestAddMember");
    console.log(data);
    $http({
      method: 'POST',
      url:  addReviewMemberAPI,
      data:data,
      headers: { 'Content-Type': 'application/json',
                'Accept': 'application/json' ,
                 'Authorization': vm.token_str }
    }).then(function successCallback(response) {
        console.log(response)
      
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }
  function deleteDocument(id){
    $http({
      method: 'DELETE',
      url:  deleteDocumentAPI+id,
      headers: { 'Content-Type': 'application/json' ,
            'Accept': 'application/json' ,
              'Authorization': vm.token_str}
    }).then(function successCallback(response) {
        console.log(response)
      
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }
  
  function submitDucument(data){
    console.log("SUBMIT DOCS")
    console.log(data)
    $http({
      method: 'POST',
      url:  addDocumentAPI,
      data:data,
      headers: { 'Content-Type': 'application/json',
                'Accept': 'application/json' ,
                'Authorization': vm.token_str }
    }).then(function successCallback(response) {
        console.log(response)
      
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }
  function addDocument(){
    //console.log("add documents")
    vm.documents.reverse();
   vm.documents.push({update:true,title:"",type:-1,url:"" });
   vm.documents.reverse();

  }
  function removeDocument(index){
   vm.document_deleteQueue.push(vm.documents[index]);
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
     vm.reviewer_deleteQueue.push(vm.reviewers[index]);
     vm.reviewers.splice(index,1)

  }
  
  function changeShop(){
    callAPI(getProjectByIDAPI+vm.selectedProject.id,"GET",function(response){
            var project_data = response.data[0];
        
            vm.selectedProject.project_name =project_data.project_name;
            vm.selectedProject.shop.id = project_data.shop;
            callAPI(getShopByIDAPI+project_data.shop,"GET",function(response){
              var shop_data = response.data[0];
              vm.selectedProject.shop = shop_data;

            })
          })
   


  
  }
  function addReviewMember (){
    console.log("add reviewers")
    vm.reviewers.reverse();
   vm.reviewers.push({update:true,employee:-1,role:-1 });
   vm.reviewers.reverse();
  }

  
  function fetchDataWithCallBack(url,callback){
    $http({
      method: 'GET',
      url:  url,
      //data:$.param({control_op:0}),
      headers: { 'Content-Type': 'application/json',
                  'Accept': 'application/json' ,
                  'Authorization': vm.token_str }
    }).then(function successCallback(response) {
        callback(response);
      
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });

  }
  
  function fetchData(url,arrayname){
    $http({
      method: 'GET',
      url:  url,
      //data:$.param({control_op:0}),
      headers: { 'Content-Type': 'application/json',
                  'Accept': 'application/json' ,
                  'Authorization': vm.token_str }
    }).then(function successCallback(response) {
 
      if(response.data){
        array =[]
        var data = response.data;
        vm[arrayname]= data;
        //if(arrayname="revTypes")console.log(response)
      // if(arrayname=="shops")console.log(data)

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
 function fetchProjectByShop(shopID){
    fetchData(getProjectByShopAPI+shopID,"projects")
  }
  function fetchProject(){
    fetchData(getProjectListAPI,"projects")
  }
  function fetchShop(){
    fetchData(getShopAPI,"shops")
  }
  //============================== Auto complete ========================
  var self = this;

    self.simulateQuery = false;
    self.isDisabled    = false;

    // list of `state` value/display objects
    self.states        = getEmployee();
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
  
    self.shopQuerySearch   = shopQuerySearch;
    self.shopSelectedItemChange = shopSelectedItemChange;
    self.shopSearchTextChange   = shopSearchTextChange;

    self.projectQuerySearch   = projectQuerySearch;
    self.projectSelectedItemChange = projectSelectedItemChange;
    self.projectSearchTextChange   = projectSearchTextChange;

   

    self.noCache = true;



    self.newState = newState;

    function newState(state) {
      alert("Sorry! You'll need to create a Constitution for " + state + " first!");
    }
     function shopNewState(state) {
      alert("Sorry! You'll need to create a Constitution for " + state + " first!");
    }

    function projectNewState(state) {
      alert("Sorry! You'll need to create a Constitution for " + state + " first!");
    }
    function querySearch (query) {
      if(!query)return vm.employees;
      var results =[];
      var lowercaseQuery = angular.lowercase(query);
      for(var i=0;i<vm.employees.length;i++){
        var filter_value = angular.lowercase(vm.employees[i].employee_name);
        
        if(filter_value.indexOf(lowercaseQuery)>=0){
          results.push(vm.employees[i]);

        }
      }
      console.log(results)
     return results;
    }
    function shopQuerySearch (query) {
      if(!query)return vm.shops;
      var results =[];
      var lowercaseQuery = angular.lowercase(query);
      for(var i=0;i<vm.shops.length;i++){
        var filter_value = angular.lowercase(vm.shops[i].shop_name_en);
        
        if(filter_value.indexOf(lowercaseQuery)>=0){
          results.push(vm.shops[i]);

        }
      }
      console.log(results)
     return results;
    }
    function projectQuerySearch (query) {
      if(!query)return vm.projects;
      var results =[];
      var lowercaseQuery = angular.lowercase(query);
      for(var i=0;i<vm.projects.length;i++){
        var filter_value = angular.lowercase(vm.projects[i].project_name);
        
        if(filter_value.indexOf(lowercaseQuery)>=0){
          results.push(vm.projects[i]);

        }
      }
      console.log(results)
     return results;
    }

    function searchTextChange(reviewer,text) {
      reviewer.update= true;
      $log.info('Text changed to ' + text);
    }
    function shopSearchTextChange(shop,text) {
     
      $log.info('Text changed to ' + text);
    }
     function projectSearchTextChange(shop,text) {
     
      $log.info('Text changed to ' + text);
    }


    function selectedItemChange(item,reviewer) {
      if(!item)return false;
     // reviewer.update = true;
      reviewer.employeeObj=item;
      reviewer.employee = item.id;
      console.log(reviewer);
     console.log(item);
      
    }
    function shopSelectedItemChange(item,shop) {
      if(!item)return false;
     // reviewer.update = true;
      console.log(shop);
     console.log(item);
     vm.selectedShopID = item.id;
     console.log(vm.project)
     //vm.project ={};
     // vm.selectedProject.id= -1;
      //vm.selectedDevelopmentID = -1 ;
    }
    function projectSelectedItemChange(item,project) {
      if(!item)return false;
     // reviewer.update = true;
      console.log(project);
      console.log(item);
      vm.selectedProject.id = item.id;
      //vm.selectedDevelopmentID = -1

    }

    
    function getEmployee(){
      return $http({
      method: 'GET',
      url:  getEmployeeAPI,
      //data:$.param({control_op:0}),
      headers: { 'Content-Type': 'application/json',
                  'Accept': 'application/json' ,
                  'Authorization': vm.token_str }
    }).then(function successCallback(response) {
 
      if(response.data){
       
        var data = response.data;
        vm.employees= data;
        return vm.employees;
      // if(arrayname=="shops")console.log(data)

      }
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
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



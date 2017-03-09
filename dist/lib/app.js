$(function(){
    var headHeight = $('header').outerHeight();

    $('body').css('padding-top', headHeight + 40);
});
var hostName= "http://172.16.252.110/";
var deleteAPI = hostName+"reviewtoolapi/review/edit/";
var getEmployeeAPI = hostName+"reviewtoolapi/employee/";
var getShopAPI = hostName+"reviewtoolapi/master/Shop/";
var getMeetingSpaceAPI =hostName+"reviewtoolapi/master/MeetSpace/";
var getProjectListAPI = hostName+"reviewtoolapi/project/";
var getProjectMemberAPI = hostName+"reviewtoolapi/project/members/?project=";
var getReviewTypeAPI =  hostName+"reviewtoolapi/master/RevType/";
var getRoleAPI = hostName+"reviewtoolapi/master/Role/";
var getDevelopmentAPI = hostName+"reviewtoolapi/project/developments/?project=";
var getDocumentTypeAPI = hostName+ "reviewtoolapi/master/DocType/";
var addReviewAPI = hostName+"reviewtoolapi/review/add/";
var addDocumentAPI = hostName+"/reviewtoolapi/review/document/add/";



angular.module('login', ['datatables', 'ngResource'])
.controller('LoginController', LoginController);


function LoginController ($resource,$translate) {
	
}



 angular.module('main', ["ngResource","ngRoute",'sidenav','review','login','pascalprecht.translate','reviewmodify','manual'])
.controller('MainController', MainController)
.directive('mainPage',reviewHtml)
.directive('logo',logoHtml)
/*var translationsEN = {
  DATE: 'Date',
  REVIEWER: 'Reviewer',
  SHOP: 'Shop',
  PROJECT: 'Project',
  DEVELOPMENT: 'Development',
  TYPE: 'Type',
  LOCATION: 'Location',
  COMMENT: 'Comment',
  BUTTON_LANG_JP: 'Japanese',
  BUTTON_LANG_EN: 'English'
};
 var translationsJP = {
  DATE: '日付',
  REVIEWER: 'レビューア',
  SHOP: 'ショップ',
  PROJECT: 'プロジェクト',
  DEVELOPMENT: '開発',
  TYPE: '種類',
  LOCATION: '場所',
  COMMENT: 'コメント',
  BUTTON_LANG_JP: '日本語',
  BUTTON_LANG_EN: '英語'
};

app.config(['$translateProvider', function ($translateProvider) {
  // add translation tables

      $translateProvider.translations('en', translationsEN);
      $translateProvider.translations('jp', translationsJP);
      $translateProvider.preferredLanguage('jp');
      $translateProvider.fallbackLanguage('en');

  
  
}]);*/
.config(['$translateProvider', function ($translateProvider) {
  // add translation tables

$translateProvider.useStaticFilesLoader({
    'prefix': 'assets/lang-',
    'suffix': '.json'
});
$translateProvider.preferredLanguage('jp');

$translateProvider.forceAsyncReload(true);
$translateProvider.useSanitizeValueStrategy('escape');
  
}])
.config(function($routeProvider,$locationProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "app/src/review.html",
        controller: "ReviewController",
        controllerAs:"vm"
    })
    .when("/review",{
        templateUrl : "app/src/review.html",
        controller: "ReviewController",
        controllerAs:"vm"
    })
    .when("/login",{
        templateUrl : "app/src/login.html",
        controller: "LoginController",
        controllerAs:"vm"
    })
    .when("/addReview",{
        templateUrl : "app/src/addreview.html",
        controller: "ReviewModifyController",
        controllerAs:"vm"
    })
    .when("/manual",{
        templateUrl : "app/src/manual.html",
        controller: "ManualController",
        controllerAs:"vm"
    })
    .otherwise({redirectTo:'/'});
   //$locationProvider.html5Mode(true);
})
.config(function($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function(date) {
       return moment(date).format('YYYY-MM-DD');
    };
})
.config(function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
})



function MainController($translate,$resource,$scope,$rootScope) {

    var vm = this;
  
    this.message = "hello";
    var headHeight = $('header').outerHeight();


    $('body').css('padding-top', headHeight + 30);
  vm.changeLanguage = function (langKey) {
    $translate.use(langKey);
  };
  $("header").on("click","#langEN",function(){
    console.log("click")
    $translate.use("en");
    $scope.$emit("english");
  })
  $("header").on("click","#langJP",function(){
    vm.changeLanguage("jp")
    $scope.$emit("japanese");
  })
  //vm.changeLanguage("en")
}

function reviewHtml(){
	return {
			restrict: 'E',
			templateUrl: 'app/src/review.html'
		};
}
function logoHtml(){
	return {
			restrict: 'E',
			templateUrl: 'app/src/logo.html'
		};
}

angular.module('manual', ['datatables', 'ngResource'])
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
var review =[
//{id:1,date:"2017-01-11T05:18:27",selected:true,shop:"BRAND",project:"CharaTV",development:"Check for bugs",type:"CDR",location:"AA3I",comment:"hello"},
];
angular.module('review', ['datatables', 'ngResource','ngMaterial','datatables.scroller'])
.controller('ReviewController', ReviewController)
.config(function($mdIconProvider) {
    $mdIconProvider
      .defaultIconSet('img/icons/sets/core-icons.svg', 24);
  })
.config(function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.delete = {};
  $httpProvider.defaults.headers.patch = {};
})
  .filter('keyboardShortcut', function($window) {
    return function(str) {
      if (!str) return;
      var keys = str.split('-');
      var isOSX = /Mac OS X/.test($window.navigator.userAgent);

      var seperator = (!isOSX || keys.length > 2) ? '+' : '';

      var abbreviations = {
        M: isOSX ? '⌘' : 'Ctrl',
        A: isOSX ? 'Option' : 'Alt',
        S: 'Shift'
      };

      return keys.map(function(key, index) {
        var last = index == keys.length - 1;
        return last ? key : abbreviations[key];
      }).join(seperator);
    };
  })

var hasSelected=false;
function ReviewController($location,$timeout,$scope, $resource,$mdDialog,$mdMenu,$http) {
    var vm = this;
    vm.hasSelected = hasSelected;
    vm.reviewSelect = reviewSelect;
    vm.checkSelected = checkSelected;
    vm.deleteReview = deleteReview;
    vm.fetchData = fetchData;
    vm.changeday = changeday;
    vm.sameDate = sameDate;
    vm.toggleDateFilter=toggleDateFilter;
    vm.datatableSearch  = datatableSearch;
    vm.gotoAddPage = gotoAddPage;
    vm.dtInstance = {};
    vm.dateFilter = false;

    vm.refreshFlag = false;
    vm.countRender = 0;
    vm.reviewDate;

        vm.dtOptions = {
            dom         : 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            columnDefs  : [
                {
                    // Target the id column
                    targets: 0,
                    width  : '50px'
                },
                {
                    // Target the id column
                    targets: 1,
                    width  : '200px'
                },
                {
                    // Target the id column
                    targets: 2,
                    width  : '200px'
                },
                {
                    // Target the id column
                    targets: 3,
                    width  : '400px'
                },
                {
                    // Target the id column
                    targets: 4,
                    width  : '130px'
                },
                {
                    // Target the id column
                    targets: 5,
                    width  : '200px'
                },
                {
                    // Target the id column
                    targets: 6,
                    width  : '200px'
                },
                {
                    // Target the id column
                    targets: 7,
                    width  : '50px'
                },
                
            ],
             initComplete:function(){ 
             //init complete will be called twice after table is created and after table is fully loaded

                if(vm.countRender==0){
                    vm.fetchData();
                }

                vm.countRender++;
               // console.log(this)
                var api = this.api(),

                    searchBox = angular.element('body').find('#review_search');

                   // console.log(searchBox)

                // Bind an external input as a table wide search box
                if ( searchBox.length > 0 )
                {
                    console.log("trigger event")
                    searchBox.on('keyup', function (event)
                    { 
                        
                       api.search(event.target.value).draw();
                        //console.log(event.target.value);
                    });
                }
                vm.changeday(0)
                
           },
           //serverSide :true,
           //destroy:true,
            pagingType  : 'full_numbers',
            lengthMenu  : [[10, 30, 50, 100,-1],[10, 30, 50, 100,"All"]],
            pageLength  : -1,
            scrollY     : '550',
            responsive  : true,
           // rowCallback : rowCallback,
           // processing : true,

        };
        vm.review=[];
        

   
   vm.openMenu= function () {
     
      $mdMenu.open();

    };
 function gotoAddPage(){
  console.log("go")
   $location.path( "/addReview" );
 }

 function fetchData(){
  //console.log("fetch")
  var today = new Date();
  

  $http({
              method: 'GET',
              url:  "http://172.16.252.110/reviewtoolapi/review/",
              //data:$.param({control_op:0}),
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                //console.log(response);
                
                if(response.data){
                   // console.log(response.data)
                    var data = response.data;
                    vm.review=[];
                     for (i in data){

                      var managerArray=data[i].pm.concat(data[i].pdm)
                       vm.review.push({select:false,id:data[i].id,manager:managerArray,date:data[i].review_date_start,location:data[i].review_location,development:{development:data[i].development,shop:data[i].shop,title:data[i].review_title},type:data[i].review_type,reviewer:data[i].reviewer})
                    }

                    //console.log(vm.review)
                  //  vm.dtInstance.rerender();
                   // vm.changeday(0)
                }
                 //console.log("data is loaded")
                
               // $scope.$apply();
              }, function errorCallback(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
              });
} 
function toggleDateFilter(){
  vm.dateFilter = !vm.dateFilter
  if(!vm.dateFilter){
   $("#reviewTable").DataTable().search("",true,true).draw();
  }else{
     
    vm.changeday(0)
  }
  console.log(vm.dateFilter)
}
function changeday(day){
 if(!vm.dateFilter)return;
  var currentDate;
//console.log(tomorrow.toLocaleDateString())
  if(vm.reviewDate){
    var currentDate = new Date(vm.reviewDate)
   // console.log(currentDate.toLocaleDateString())
   // dateObj.setDate((new Date(vm.reviewDate)) + 1000*3600*24)
    currentDate.setDate(currentDate.getDate()+day);
    //console.log(currentDate.toLocaleDateString())
  
  }else{
    currentDate=new Date();
  }
  
  vm.reviewDate=currentDate;
  datatableSearch(currentDate)
}
function sameDate(date1,date2){
  var d1 = new Date(date1);
  var d2 = new Date(date2);
  console.log(d1.getTime() === d2.getTime())
  return d1.getTime() === d2.getTime();
}
function datatableSearch(val){
 // console.log("SearchDate")
  //console.log(val)
  var dateObj = new Date(val);
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
var day = dateObj.getDate();
var year = dateObj.getFullYear();
var monthStr = ""
var dayStr = ""
if(month<10){
  monthStr = "0"+month
}else{
  monthStr = month;
}
if(day<10){
dayStr = "0"+day;
}else{
  dayStr=day;
}
var newdate = year + "-" + monthStr + "-" + dayStr;
 // console.log("searchDate:"+newdate)
  $("#reviewTable").DataTable().search(newdate,true,true).draw();
 // console.log($("#reviewTable"))

}
function deleteReview(){///reviewtoolapi/review/{id}/delete/
  var id = getselectedReview();
  console.log(id);
  console.log(deleteAPI)
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
  }).then(function () {
    $.ajax({
    url: deleteAPI+id,
    type: 'DELETE',
    success: function(result) {
        // Do something with the result
        vm.fetchData();
                swal(
                  'Deleted!',
                  'Your file has been deleted.',
                  'success'
                )
      }
    });

  /*  $http({
              method: 'DELETE',
              url: deleteAPI+id,
              //data:$.param({control_op:0}),
              
            }).then(function successCallback(response) {
                vm.fetchData();
                swal(
                  'Deleted!',
                  'Your file has been deleted.',
                  'success'
                )
              }, function errorCallback(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
        });*/
   } 
    
  )
  
  

}
function checkSelected(){
  return vm.hasSelected;
}
function getselectedReview(){
  for(var i =0;i<vm.review.length;i++){
    
   if(vm.review[i].selected)return vm.review[i].id;
  }
  return -1
}
function reviewSelect(id){
  //console.log(id)
  var selected_review = getReview(id);
  if(!selected_review){
    //console.log("no")
    vm.hasSelected = false;
  }else{
    //console.log(selected_review.id)
    var check =!selected_review.selected;
    clearSelectReview();
    selected_review.selected = check;
    vm.hasSelected = check;
    //console.log(hasSelected)

  }

}
function clearSelectReview(){
  for(var i =0;i<vm.review.length;i++){
   vm.review[i].selected=false;
  }
}
function getReview(id){
  
  for(var i =0;i<vm.review.length;i++){
    if(vm.review[i].id==id)return vm.review[i];
  }
  return null;
}  
   
}





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

    */
   
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





angular
  .module('sidenav', ['ngMaterial'])
  .controller('AppCtrl',['$scope', '$timeout', '$mdSidenav', '$log', function ($scope, $timeout, $mdSidenav, $log) {
    var vm = this;
    vm.toggleLeft = buildDelayedToggler('left');
    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };
    $("header").on("click","#wni-header #menu",function(){
      console.log("hello")
      vm.toggleLeft();
    })
    $scope.closeLeft = function () {
     
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });

    };
   
    vm.data = [
    {name:"Login",href:"#/login",icon:"lock"},
     {name:"Review",href:"#/review",icon:"description"},

      {name:"Manual",href:"#/manual",icon:"grade"},
      {name:"Print",href:"#/new",icon:"print"},
    ];
    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    
    function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }

    function buildToggler(navID) {
      return function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      };
    }
  }])
  .controller('LeftCtrl',['$scope', '$timeout', '$mdSidenav', '$log', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });

    };
  }])
  .controller('RightCtrl',['$scope', '$timeout', '$mdSidenav', '$log', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };
  }]);
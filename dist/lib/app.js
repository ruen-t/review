$(function(){
    var headHeight = $('header').outerHeight();

    $('body').css('padding-top', headHeight + 40);
});
var hostName= "http://pt-reviewtool-vmg.wni.co.jp/easyreviewapi/";

var getEmployeeAPI = hostName+"employee/";
var getUserInfo = hostName+"employee/current/"
var getEmployeeByIDAPI = hostName+"employee/?id=";
var getShopAPI = hostName+"master/Shop/";
var getMeetingSpaceAPI =hostName+"master/MeetSpace/";
var getProjectListAPI = hostName+"project/";
var getProjectMemberAPI = hostName+"project/members/?project=";
var getProjectByIDAPI = hostName+"project/?id=";
var getProjectByShopAPI = hostName+"project/search/?data=detail&key=SHOPCODE&query=";
var getShopByIDAPI = hostName+"master/Shop/";



var getReviewTypeAPI =  hostName+"master/RevType/";
var getRoleAPI = hostName+"master/Role/";
var getDevelopmentAPI = hostName+"project/developments/?project=";
var getDevelopmentIDAPI = hostName+"project/developments/?id=";
var getDocumentTypeAPI = hostName+ "master/DocType/";


var getReviewAPI = hostName+"review/";
var getReviewByDateAPI = hostName+"review/search/?data=detail&key=DATE&query=";
var getSpecificReviewAPI = getReviewAPI+"?id=";
var addReviewAPI = hostName+"review/";
var editReviewAPI = hostName+"review/edit/";
var deleteAPI = hostName+"review/edit/";

var getFeedbackAPI=hostName+"review/feedbacks/?review=";
var addFeedbackAPI=hostName+"review/feedbacks/";
var editFeedbackAPI=hostName+"review/feedback/";

var getReviewMemberAPI= hostName+"review/members/?review=";
var deleteReviewMemberAPI= hostName+"review/member/edit/";
var addReviewMemberAPI= hostName+"review/members/";

var getReviewDocumentAPI = hostName+"review/documents/?review=";
var addDocumentAPI = hostName+"review/documents/";
var deleteDocumentAPI = hostName+"review/document/edit/";

angular.module('content',[])
.controller('ContentController', ContentController);

function ContentController ($http,$routeParams,$translate,$rootScope) {
	var vm = this;
  var token = getCookie("token_django");

  var token_str = 'Bearer '+token;
  vm.token_str = token_str;
   vm.reviewID = $routeParams.id;
   
   vm.feedbackCount =0 ;
   vm.addFeedback = addFeedback;
  //console.log(vm.reviewID)
	vm.isEnglish = false;
   $rootScope.$on("english",function(){
   		//console.log("hello english")
   		vm.isEnglish=true;
   });
	$rootScope.$on("japanese",function(){
   		//console.log("hello japanese");
   		vm.isEnglish = false;
   });
   if(vm.reviewID){
      fetchReview();
      fetchReviewMember();
      getCurrentUserInfo();
      fetchFeedback();

   }
  function getCurrentUserInfo(){
     $http({
         method: 'GET',
         url:  getUserInfo,
         headers: { 'Content-Type': 'application/json',
                  'Accept': 'application/json' ,
                  'Authorization': token_str }
       }).then(function successCallback(response) {
          
          if(response.data){
            vm.userInfo = response.data;
            console.log(vm.userInfo);
          }
      
     }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }

   function addFeedback(){
    
    

      var feedback_giver = vm.userInfo.id;
      var feedback = vm.feedback;
      var reviewID = vm.reviewID;
      var data ={feedback:feedback,feedback_giver:feedback_giver,review:reviewID};
      $http({
         method: 'POST',
         url:  addFeedbackAPI,
         data:data,
         headers: { 'Content-Type': 'application/json',
                  'Accept': 'application/json' ,
                  'Authorization': token_str }
       }).then(function successCallback(response) {
         console.log(response);
         location.reload();
        
      
     }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
   }
   function fetchFeedback(){
      $http({
      method: 'GET',
      url:  getFeedbackAPI+vm.reviewID,
      headers: { 'Content-Type': 'application/json',
                 'Accept': 'application/json' ,
                 'Authorization': token_str }
    }).then(function successCallback(response) {
      //console.log(response)
      if(response.data){
        vm.feedbackList = response.data;
        for (var i =0;i<vm.feedbackList.length;i++){
          var giverID = vm.feedbackList[i].feedback_giver;
          var feedbackText = vm.feedbackList[i].feedback;
          callAPI(getEmployeeByIDAPI+giverID,"GET",function(response){
            if(response.data){
              console.log(response.data)
             var giver = response.data[0];
             for(var j =0;j<vm.feedbackList.length;j++){
              if(vm.feedbackList[j].feedback_giver==giver.id&&vm.feedbackList[j].giver==null){
                vm.feedbackList[j].giver = giver;
              }
             }
            }
            //console.log(vm.feedbackList);
          })
        }
       


      }


       
      
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });

   }
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
   function fetchReview(){
    $http({
      method: 'GET',
      url:  getSpecificReviewAPI+vm.reviewID,
      headers: { 'Content-Type': 'application/json',
                 'Accept': 'application/json' ,
                 'Authorization': token_str }
    }).then(function successCallback(response) {
 
      if(response){
        var data = response.data[0];
        //console.log(data)
        vm.review = data;
    
        
        callAPI(getMeetingSpaceAPI+data.review_location,"GET",function(response){
          var location_data = response.data[0];
          //console.log(location_data);
          vm.review.review_location = location_data;
        });
        callAPI(getReviewTypeAPI+data.review_type,"GET",function(response){
          var review_type_data = response.data[0];
          //console.log(location_data);
          vm.review.review_type = review_type_data;
        });
        //get Project and shop name
         callAPI(getDevelopmentIDAPI+data.development,"GET",function(response){
          console.log(response.data[0]);
          var development_data = response.data[0];
          vm.review.development = development_data;
          var project_id = development_data.project;
          
          callAPI(getProjectByIDAPI+project_id,"GET",function(response){
            var project_data = response.data[0];
            //console.log(project_data);
            vm.review.project = project_data;
           
            callAPI(getShopByIDAPI+project_data.shop,"GET",function(response){
              var shop_data = response.data[0];
              vm.review.shop = shop_data;

            })
          })
        })
       // vm.startDate = new Date(data.review_date_start);
       // vm.endDate = new Date(data.review_date_end);

       
      }
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
   }
   function fetchReviewMember(){
         $http({
            method: 'GET',
            url:  getReviewMemberAPI+vm.reviewID,
            headers: { 'Content-Type': 'application/json',
                        'Accept': 'application/json' ,
                         'Authorization': token_str }
       }).then(function successCallback(response) {
         vm.reviewers ={};
         if(response){
         
           var data = response.data;
         // console.log(data);

           vm.reviewers = data;
           var index =0;
           //console.log(vm.reviewers);
           for(var i =0;i<vm.reviewers.length;i++){
            vm.reviewers[i].employee_data = {};
            vm.reviewers[i].role_data = null;
            //console.log(vm.reviewers[i])
            callAPI(getEmployeeByIDAPI+vm.reviewers[i].employee,"GET",function(response){
              //console.log(response.data[0]);
              //console.log(vm.reviewers)
             var reviewer_data =response.data[0];
              for(index =0;index<vm.reviewers.length;index++){
                if(vm.reviewers[index].employee ==reviewer_data.id){
                  vm.reviewers[index].employee_data = reviewer_data;
                  
                  break;
                }
              }

            })

             callAPI(getRoleAPI+vm.reviewers[i].role,"GET",function(response){
            
             var role_data =response.data[0];
              for(index =0;index<vm.reviewers.length;index++){

               if(vm.reviewers[index].role ==role_data.id&&vm.reviewers[index].role_data==null){
                  vm.reviewers[index].role_data = role_data;
                  
                  break;
                }
               // console.log(vm.reviewers)
              }

            })
           }
          // vm.reviewers.forEach(function(v){v.feedback=""});
         
            
          
         }
       }, function errorCallback(data, status, headers, config) {
         // called asynchronously if an error occurs
         // or server returns response with an error status.
       });
   }
    
}


angular.module('login', ['datatables', 'ngResource'])
.controller('LoginController', LoginController);

var vm;

function LoginController ($resource,$translate,$http,$location) {
	vm = this;
	vm.http =$http
	vm.onSignIn = onSignIn;
	vm.requestDJangoToken = requestDJangoToken;
	vm.signOut = signOut;
  vm.loggedIn = false;
  vm.location = $location;
  var token = getCookie("token_django");
  if(token)vm.loggedIn = true;
}
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    //var client_id = "BufEoI2OhtOiVwCLpdrPFZrqXHO3Fd9Zk5xmY4mK";
    console.log("onSignIn")
    var client_id ="I2IAnOzO7QorjqfgXX4YbBUJ6w5ASt8w5qWcwbW1";
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    var authData = googleUser.getAuthResponse(true);
    console.log(authData);
    var data = {"grant_type": "convert_token", "client_id":client_id, "backend":"google-oauth2", "token":authData.access_token}
    var json_data = JSON.stringify(data);
    requestDJangoToken(json_data);
    
    
  }


  function requestDJangoToken(json){
    console.log(json)
    vm.http({
              method: 'POST',
              url:  "http://pt-reviewtool-vmg.wni.co.jp/easyreviewapi/auth/convert-token/",
              data:json,
              headers: { 'Content-Type': 'application/json' }
            }).then(function successCallback(response) {
                
                console.log(response);
                var today = new Date();
                var tomorrow = new Date()
                tomorrow.setDate(today.getDate()+1);
                //console.log(tomorrow);
                document.cookie = "token_django="+response.data.access_token+"; expires="+today
               vm.loggedIn = true;
                console.log(document.cookie);
                console.log(getCookie("token_django"))
               
                
                
               
              }, function errorCallback(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
              });
  }

 function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function delete_cookie( name ) {
  console.log("delete cookie")
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
function signOut() {
  console.log("signOut")
          var auth2 = gapi.auth2.getAuthInstance();
          auth2.signOut().then(function() {
          console.log('User signed out.');
          });
          delete_cookie("token_django")
         vm.loggedIn = false;
        vm.location.path( "/login" );
        }
       






 angular.module('main', ['angular-loading-bar',"ngResource","ngRoute",'sidenav','review','login','pascalprecht.translate','reviewmodify','manual','content',"test"])
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
//$translateProvider.useSanitizeValueStrategy('escape');
  
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
    .when("/test",{
        templateUrl : "app/src/test.html",
        controller: "TestController",
        controllerAs:"ctrl"
    })
    .when("/addReview",{
        templateUrl : "app/src/addeditreview.html",
        controller: "ReviewModifyController",
        controllerAs:"vm"
    })
    .when("/editReview/:id",{
        templateUrl : "app/src/addeditreview.html",
        controller: "ReviewModifyController",
        controllerAs:"vm"
    })
    .when("/manual",{
        templateUrl : "app/src/manual.html",
        controller: "ManualController",
        controllerAs:"vm"
    })
    .when("/content/:id",{
        templateUrl : "app/src/content.html",
        controller: "ContentController",
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
  
  $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
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
var scope;
function ReviewController($location,$timeout,$scope, $resource,$mdDialog,$mdMenu,$http) {
    var vm = this;
     scope = $scope;
     vm.currentRange = 2;
    scope.totalDisplayed = 600;
    vm.hasSelected = hasSelected;
    vm.reviewSelect = reviewSelect;
    vm.checkSelected = checkSelected;
    vm.deleteReview = deleteReview;
    vm.fetchData = fetchData;
    vm.changeday = changeday;
    vm.sameDate = sameDate;
    vm.toggleDateFilter=toggleDateFilter;
    vm.datatableSearch  = datatableSearch;
    vm.loadMoreReview = loadMoreReview;
    vm.gotoAddPage = gotoAddPage;
    vm.gotoEditPage = gotoEditPage;
    vm.gotoContentPage = gotoContentPage;
    vm.dtInstance = {};
    vm.dateFilter = false;

    vm.refreshFlag = false;
    vm.countRender = 0;
    vm.reviewDate;
    vm.datatableAPI ;
        vm.dtOptions = {
            dom         : 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            columnDefs  : [
                {
                    // Target the id column
                    targets: 0,
                    width  : '50px',
                    sortable:false,
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

                vm.datatableAPI = this.api();

                var  searchBox = angular.element('body').find('#review_search');

                   // console.log(searchBox)

                // Bind an external input as a table wide search box
                if ( searchBox.length > 0 )
                {
                    //console.log("trigger event")
                    searchBox.on('keyup', function (event)
                    { 
                        
                       vm.datatableAPI.search(event.target.value).draw();
                        //console.log(event.target.value);
                    });
                }
                vm.changeday(0);
                
               /* this.on( 'page.dt', function () {
                  
                  scope.totalDisplayed+=30;
                  console.log("total: "+scope.totalDisplayed);
            } );*/
                //vm.totalDisplayed = 600;
                
           },
           //serverSide :true,
           //destroy:true,
           deferRender: true,
           processing: true,
            pagingType  : 'full_numbers',
            lengthMenu  : [[10, 30, 50,-1],[10, 30, 50,"All"]],
            pageLength  : 10,
            scrollY     : '450',
           // destroy:true,
            bRetrieve:true,
            language: {
         "emptyTable": '<img src="assets/ring.gif"  />',
           "zeroRecords": "No records to display",
            },
           
            //responsive  : true,
           // rowCallback : rowCallback,
           // processing : true,

        };

        vm.review=[];
        

   
   vm.openMenu= function () {
     
      $mdMenu.open();

    };
 function gotoAddPage(){
 // console.log("go add")
   $location.path( "/addReview" );
 }
 function gotoEditPage(){
  //console.log("go edit")
  var selectedID = getselectedReview();
  $location.path( "/editReview/"+selectedID );
 }
 function gotoContentPage(id){
  // console.log("go content:"+id)
  $location.path( "/content/"+id );

 }
 function appendReview(dateRange){
  var token = getCookie("token_django");
      if(!token){
       $location.path( "/login" );
       return;
     }
      var token_str = 'Bearer '+token;
   $http({
              method: 'GET',
              url:  getReviewByDateAPI+dateRange,
              headers: { 'Content-Type': 'application/json',
                          'Accept': 'application/json' ,
                         'Authorization': token_str }
            }).then(function successCallback(response) {
              console.log(getReviewByDateAPI+dateRange)
                if(response.data){
                   //console.log(response.data)
                    var data = response.data;
                     for (i in data){
                      if(!data[i].pm){
                        data[i].pm="";
                      } if(!data[i].pdm){
                        data[i].pdm = "";
                      }
                       var managerArray=data[i].pm.split(",").concat(data[i].pdm.split(","));
                       vm.review.push({select:false,id:data[i].id,manager:managerArray,date:data[i].review_date_start,location:data[i].meetspace_name_en,development:data[i].development_code,title:data[i].review_title,type_en:data[i].revtype_name_en,type_jp:data[i].revtype_name_jp,reviewer:data[i].reviewer});
                  // vm.datatableAPI.rows.add({select:false,id:data[i].id,manager:managerArray,date:data[i].review_date_start,location:data[i].meetspace_name_en,development:data[i].development_code,title:data[i].review_title,type_en:data[i].revtype_name_en,type_jp:data[i].revtype_name_jp,reviewer:data[i].reviewer})
                   
                    }
                     console.log(vm.review);
                     vm.dtInstance.rerender();//DataTable.draw();
              
                }
                
              }, function errorCallback(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
              });
 }
 function loadMoreReview(duration){
   var start = new Date();
   start.setDate(1);
  start.setMonth(start.getMonth()-vm.currentRange);
  var end = new Date();
  end.setDate(1);
  end.setMonth(end.getMonth()+vm.currentRange);
  var current_start_date_str = toJSONLocal(start);
  var current_end_date_str = toJSONLocal(end);
   start.setMonth(start.getMonth()-duration);
   end.setMonth(end.getMonth()+duration);
var start_date_str = toJSONLocal(start);
var end_date_str = toJSONLocal(end);
console.log(current_start_date_str);
console.log(start_date_str);
console.log(current_end_date_str);
console.log(end_date_str);

      var leftdate = start_date_str+"|"+current_start_date_str;
      var rightdate = current_end_date_str+"|"+end_date_str;
  appendReview(leftdate);
  appendReview(rightdate);
  vm.currentRange + duration;




 }
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function toLocal (date) {
  var local = new Date(date);
  local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return local.toJSON();
}

function toJSONLocal (date) {
  var local = new Date(date);
  local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
}
 function fetchData(){
  //console.log("fetch")
  var start = new Date();
   start.setDate(1);
  start.setMonth(start.getMonth()-vm.currentRange);
  var end = new Date();
   end.setDate(1);
  end.setMonth(end.getMonth()+vm.currentRange);
  var start_date_str = toJSONLocal(start);
  var end_date_str = toJSONLocal(end);
  console.log(start_date_str);
  console.log(end_date_str);

  
 /* $.ajax({
          type: "GET",
          url: getReviewAPI
      })
      .done(function(data) {
       
        if(data){

            vm.review=[];
            for (i in data){
              console.log(data[i])
                var managerArray=data[i].pm.concat(data[i].pdm)
                  vm.review.push({select:false,id:data[i].id,manager:managerArray,date:data[i].review_date_start,location:data[i].review_location,development:{development:data[i].development,shop:data[i].shop,title:data[i].review_title},type:data[i].review_type,reviewer:data[i].reviewer})
                    }

                   
                }
              $scope.$apply();  

      });*/
      var token = getCookie("token_django");
      if(!token){
       $location.path( "/login" );
       return;
     }
      var token_str = 'Bearer '+token;
      console.log(token_str);
    
      var date = start_date_str+"|"+end_date_str;
      console.log(getReviewByDateAPI+date)
  $http({
              method: 'GET',
              url:  getReviewByDateAPI+date,
              //data:$.param({control_op:0}),
              headers: { 'Content-Type': 'application/json',
                          'Accept': 'application/json' ,
                         'Authorization': token_str }
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(response);
                
                if(response.data){
                   
                    var data = response.data;
                    vm.review=[];
                     for (i in data){
                    
                      if(!data[i].pm){
                        data[i].pm="";
                      } if(!data[i].pdm){
                        data[i].pdm = "";
                      }if(!data[i].reviewer){
                        data[i].reviewer = "";
                      }
                       var managerArray=data[i].pm.split(",").concat(data[i].pdm.split(","))
                       console.log(managerArray)
                       var reviewersArray=data[i].reviewer.split(",");
                      //var manager = data[i].pm+","+data[i].pdm;
                       vm.review[i]={select:false,id:data[i].id,manager:managerArray,date:data[i].review_date_start,location:data[i].meetspace_name_en,development:data[i].development_code,title:data[i].review_title,type_en:data[i].revtype_name_en,type_jp:data[i].revtype_name_jp,reviewers:reviewersArray}
                    }

                    console.log(vm.review)
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
  //console.log(day)
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
 // console.log(d1.getTime() === d2.getTime())
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
  var token = getCookie("token_django");
      if(!token){
       $location.path( "/login" );
       return;
     }
      var token_str = 'Bearer '+token;
  //console.log(id);
  //console.log(deleteAPI)
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
  }).then(function () {

     $http({
              method: 'DELETE',
              url:  deleteAPI+id,
              //data:$.param({control_op:0}),
              headers: { 'Content-Type': 'application/json',
                          'Accept': 'application/json' ,
                         'Authorization': token_str }
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(response);
                 vm.fetchData();
                swal(
                  'Deleted!',
                  'Your file has been deleted.',
                  'success'
                )
               
                
               // $scope.$apply();
              }, function errorCallback(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
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
    $location.path( "/login" );
    return;
  }
    var token_str = 'Bearer '+token;
    vm.token_str= token_str;
   vm.state =0; //0 -> add, 1-> edit
  vm.editId = $routeParams.id;
  console.log(vm.editId)

    vm.reviewers = [
  {update:true,employee:[],role:-1 },
 /* {id:2,role:2 },*/
];;
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
    vm.document_deleteQueue=[];
    vm.reviewer_deleteQueue=[];
     

  
  if(!vm.editId){
    vm.state=0;
    $('#startdate').datetimepicker();
                    $('#enddate').datetimepicker({
                        useCurrent: false //Important! See issue #1075
                    });
                    $("#startdate").on("dp.change", function (e) {

                        $('#enddate').data("DateTimePicker").minDate(e.date);
                      
                       
                    });
                    $("#enddate").on("dp.change", function (e) {
                        $('#startdate').data("DateTimePicker").maxDate(e.date);
           
           
        });

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
            var project_data = response.data[0];
            console.log(project_data);
            vm.selectedProject.project_name =project_data.project_name;
            vm.selectedProject.shop.id = project_data.shop;
            callAPI(getShopByIDAPI+project_data.shop,"GET",function(response){
              var shop_data = response.data[0];
              vm.selectedProject.shop = shop_data;
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
  
$scope.$watch("vm.selectedShopID",function(newValue,oldValue){
   if(vm.selectedShopID>0){
    vm.shopSelected = true;
   
     fetchProjectByShop(vm.selectedShopID);
   }
  
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
  fetchShop();
  fetchProject();

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
            var doc = {document_url:vm.documents[i].url,document_type:vm.documents[i].type,document_title:vm.documents[i].title,review:vm.editId};
            var json_doc = JSON.stringify(doc);
           // console.log(json_doc)
            if(vm.documents[i].update)submitDucument(json_doc); 
         }  
         for (var i =0;i<vm.document_deleteQueue.length;i++){
            deleteDocument(vm.document_deleteQueue[i].id);
          }
          for (var i =0;i<vm.reviewers.length;i++){
            if(!vm.reviewers[i].update)continue;
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
              //$location.path( "/" );
          });

       });

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
          var doc = {document_url:vm.documents[i].url,document_type:vm.documents[i].type,document_title:vm.documents[i].title,review:createdID};
          var json_doc = JSON.stringify(doc);
          //console.log(json_doc)
          submitDucument(json_doc);
         
         }
         for (var i =0;i<vm.reviewers.length;i++){
          if(!vm.reviewers[i].update)continue;
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
              //$location.path( "/" );
          });
       

       }

      
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
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
  
    self.noCache = true;



    self.newState = newState;

    function newState(state) {
      alert("Sorry! You'll need to create a Constitution for " + state + " first!");
    }

    function querySearch (query) {
      if(!query)return vm.employees;
      var results =[];
      var lowercaseQuery = angular.lowercase(query);
      for(var i=0;i<vm.employees.length;i++){
        var filter_value = angular.lowercase(vm.employees[i].employee_name);
        if(filter_value.indexOf(lowercaseQuery)==0){
          results.push(vm.employees[i]);

        }
      }
      console.log(results)
     return results;
    }

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item,reviewer) {
      reviewer.employeeObj=item;
      reviewer.employee = item.employee_no;
      console.log(reviewer);
     console.log(item);
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
     
      vm.toggleLeft();
    })
    $scope.closeLeft = function () {
     
      $mdSidenav('left').close()
        .then(function () {
         // $log.debug("close LEFT is done");
        });

    };
   
    vm.data = [
    {name:"Login",href:"#/login",icon:"lock"},
     {name:"Review",href:"#/review",icon:"description"},

      {name:"Manual",href:"#/manual",icon:"grade"},
      
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
            //$log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }

    function buildToggler(navID) {
      return function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            //$log.debug("toggle " + navID + " is done");
          });
      };
    }
  }])
  .controller('LeftCtrl',['$scope', '$timeout', '$mdSidenav', '$log', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('left').close()
        .then(function () {
          //$log.debug("close LEFT is done");
        });

    };
  }])
  .controller('RightCtrl',['$scope', '$timeout', '$mdSidenav', '$log', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('right').close()
        .then(function () {
        //  $log.debug("close RIGHT is done");
        });
    };
  }]);
angular
      .module('test', ['ngMaterial'])
      .controller('TestController', TestController);

  function TestController ($timeout, $q, $log) {
    var self = this;

    self.simulateQuery = false;
    self.isDisabled    = false;

    // list of `state` value/display objects
    self.states        = loadAll();
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
  
    self.noCache = true;



    self.newState = newState;

    function newState(state) {
      alert("Sorry! You'll need to create a Constitution for " + state + " first!");
    }

    function querySearch (query) {
      var results = query ? self.states.filter( createFilterFor(query) ) : self.states,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }

    

    function loadAll() {
      var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';

      return allStates.split(/, +/g).map( function (state) {
        return {
          value: state.toLowerCase(),
          display: state
        };
      });
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };

    }
  
}
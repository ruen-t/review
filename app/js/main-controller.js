 angular.module('main', ['angular-loading-bar',"ngResource","ngRoute",'sidenav','review','login','pascalprecht.translate','reviewmodify','manual','content',"test","history"])
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
    .when("/review/:startdate/:enddate",{
        templateUrl : "app/src/review.html",
        controller: "ReviewController",
        controllerAs:"vm"
    })
    .when("/login",{
        templateUrl : "app/src/login.html",
        controller: "LoginController",
        controllerAs:"vm"
    })
    .when("/login/:state",{
        templateUrl : "app/src/login.html",
        controller: "LoginController",
        controllerAs:"vm"
    })
    .when("/login/:state/:id",{
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
    .when("/history",{
        templateUrl : "app/src/history.html",
        controller: "HistoryController",
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
     $('body').css('visibility', "visible");
    
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

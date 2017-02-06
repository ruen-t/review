var app= angular.module('main', ["ngRoute",'sidenav','review','project']);
app.controller('MainController', MainController)
app.directive('mainPage',reviewHtml)
app.directive('logo',logoHtml);
app.config(function($routeProvider,$locationProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "app/src/review.html",
        controller: "ReviewController",
        controllerAs:"vm"
    })
    .when("/review", {
        templateUrl : "app/src/review.html",
        controller: "ReviewController",
        controllerAs:"vm"
    })
    .when("/project", {
        templateUrl : "app/src/project.html",
        controller: "ProjectController",
        controllerAs:"vm"
    })
    .otherwise({redirectTo:'/'});
   //$locationProvider.html5Mode(true);
});
function MainController() {
    var vm = this;
    this.message = "hello";
    var headHeight = $('header').outerHeight();

    $('body').css('padding-top', headHeight + 10);
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
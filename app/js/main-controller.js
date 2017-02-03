angular.module('main', ['sidenavDemo1','review'])
.controller('MainController', MainController)
.directive('mainPage',reviewHtml)
.directive('logo',logoHtml);

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
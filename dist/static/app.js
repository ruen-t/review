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
angular.module('project', ['datatables', 'ngResource'])
.controller('ProjectController', ProjectController);

function ProjectController($resource) {
    var vm = this;
    vm.message = "hello this is a project page"
    
}

angular.module('review', ['datatables', 'ngResource'])
.controller('ReviewController', ReviewController);

function ReviewController($resource) {
    var vm = this;
   /* $.get( "http://172.16.252.110/reviewtoolapi/review/simple/", function( data ) {
  		vm.review = data;
  		console.log(vm.review);
  	
	});*/
    $resource('all.json').query().$promise.then(function(project) {
      // console.log(project);  
      vm.project = project;
    });
}

angular
  .module('sidenav', ['ngMaterial'])
  .controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };
    $scope.closeLeft = function () {
     
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });

    };
    var vm = this;
    vm.data = [
      {name:"Project",href:"#/project",icon:"grade"},
      {name:"Review",href:"#/review",icon:"description"},
      {name:"New",href:"#/new",icon:"print"},
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
  })
  .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });

    };
  })
  .controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };
  });
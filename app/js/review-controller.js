angular.module('review', ['datatables', 'ngResource','ngMaterial','datatables.scroller'])
.controller('ReviewController', ReviewController)
.config(function($mdIconProvider) {
    $mdIconProvider
      .defaultIconSet('img/icons/sets/core-icons.svg', 24);
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
var review =[
{id:1,date:"2017-01-11T05:18:27",selected:true,shop:"BRAND",project:"CharaTV",development:"Check for bugs",type:"CDR",location:"AA3I",comment:"hello"},
{id:2,date:"2017-06-11T05:10:00",selected:false,shop:"SEA",project:"Project2",development:"Check for nothing",type:"ABC",location:"AA6I",comment:"hi"},
];
var hasSelected=false;
function ReviewController($scope, $resource,$mdDialog,$mdMenu) {
    var vm = this;
    vm.hasSelected = hasSelected;
    vm.reviewSelect = reviewSelect;
    vm.checkSelected = checkSelected;
    vm.deleteReview = deleteReview;
    vm.dtInstance = {};
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
                    width  : '270px'
                },
                
            ],
          
            pagingType  : 'full_numbers',
            lengthMenu  : [[10, 30, 50, 100,-1],[10, 30, 50, 100,"All"]],
            pageLength  : -1,
            scrollY     : 'auto',
            responsive  : true,
           // rowCallback : rowCallback,
           // processing : true,

        };
    $.get( "http://172.16.252.110/reviewtoolapi/review/", function( data ) {
  		//vm.review = data;
  		console.log(vm.review);
  	
	});
   vm.openMenu= function () {
     
      $mdMenu.open();

    };
    $resource('all.json').query().$promise.then(function(project) {
      // console.log(project);  
      vm.project = project;
    });
    vm.review = review;
    
   
}
function deleteReview(){
  var id = getselectedReview();
  console.log(id);


}
function checkSelected(){
  return hasSelected;
}
function getselectedReview(){
  for(var i =0;i<review.length;i++){
   if(review[i].selected)return review[i].id;
  }
}
function reviewSelect(id){
  var selected_review = getReview(id);
  if(!selected_review){
    //console.log("no")
    return false;
  }else{
    //console.log(selected_review.id)
    var check =!selected_review.selected;
    clearSelectReview();
    selected_review.selected = check;
    hasSelected = check;
    //console.log(hasSelected)

  }

}
function clearSelectReview(){
  for(var i =0;i<review.length;i++){
   review[i].selected=false;
  }
}
function getReview(id){
  
  for(var i =0;i<review.length;i++){
    if(review[i].id==id)return review[i];
  }
  return null;
}
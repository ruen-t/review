angular.module('review', ['datatables', 'ngResource'])
.controller('ReviewController', ReviewController);
var review =[
{id:1,date:"2017-01-11T05:18:27",selected:true,shop:"BRAND",project:"CharaTV",development:"Check for bugs",type:"CDR",location:"AA3I",comment:"hello"},
{id:2,date:"2017-06-11T05:10:00",selected:false,shop:"SEA",project:"Project2",development:"Check for nothing",type:"ABC",location:"AA6I",comment:"hi"},
];
function ReviewController($resource) {
    var vm = this;
    vm.reviewSelect = reviewSelect;
   /* $.get( "http://172.16.252.110/reviewtoolapi/review/simple/", function( data ) {
  		vm.review = data;
  		console.log(vm.review);
  	
	});*/

    $resource('all.json').query().$promise.then(function(project) {
      // console.log(project);  
      vm.project = project;
    });
    vm.review = review;
}
function reviewSelect(id){
  var selected_review = getReview(id);
  if(!selected_review){
    console.log("no")
    return false;
  }else{
    //console.log(selected_review.id)
    clearSelectReview();
    selected_review.selected = true;

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
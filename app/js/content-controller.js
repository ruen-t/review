angular.module('content',[])
.controller('ContentController', ContentController);

function ContentController ($http,$routeParams,$translate,$rootScope) {
	var vm = this;
   vm.reviewID = $routeParams.id;
   vm.dateClick = dateClick;
  console.log(vm.reviewID)
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

   }



   function fetchReview(){
    $http({
      method: 'GET',
      url:  getSpecificReviewAPI+vm.reviewID,
      headers: { 'Content-Type': 'application/json' }
    }).then(function successCallback(response) {
 
      if(response.data){
        var data = response.data[0];
       // console.log(data)
        vm.review = data;
        vm.startDate = new Date(data.review_date_start);
        vm.endDate = new Date(data.review_date_end);

       
      }
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
   }
   function fetchReviewMember(){
         $http({
            method: 'GET',
            url:  getReviewMember+vm.reviewID,
            headers: { 'Content-Type': 'application/json' }
       }).then(function successCallback(response) {
    
         if(response.data){
           var data = response.data;
           console.log(data);
           vm.reviewers = data;
          
          
         }
       }, function errorCallback(data, status, headers, config) {
         // called asynchronously if an error occurs
         // or server returns response with an error status.
       });
   }
    function dateClick(event){
      console.log("prevent")
      event.preventDefault();
    }
}
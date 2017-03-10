angular.module('content',[])
.controller('ContentController', ContentController);

function ContentController ($http,$routeParams,$translate,$rootScope) {
	var vm = this;
   vm.reviewID = $routeParams.id;
   vm.saveButtonClick = saveButtonClick;
   vm.feedbackCount =0 ;
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

   }
function saveButtonClick(){

   console.log(vm.reviewers)
   swal({
     title: 'Are you sure to submit feedback?',
     text: "",
     type: 'warning',
     showCancelButton: true,
     confirmButtonColor: '#3085d6',
     cancelButtonColor: '#d33',
     confirmButtonText: 'Yes, submit it!'
   }).then(function () {
      /*
      {
        "active": true,
        "feedback": "string",
        "feedback_giver": "string",
        "review": "string"
      }
      */
      vm.feedbackCount=0;
      for(i in vm.reviewers){
         var reviewer = vm.reviewers[i];
         var feedback={active:true,feedback:reviewer.feedback,feedback_giver:reviewer.employee.id,review:vm.reviewID};
         var json = JSON.stringify(feedback);
         console.log(json)
         addFeedback(json,vm.reviewers.length);

      }
      
     
   })
  }
   function addFeedback(data,feedback_number){
      $http({
         method: 'POST',
         url:  addFeedbackAPI,
         data:data,
         headers: { 'Content-Type': 'application/json' }
       }).then(function successCallback(response) {
          vm.feedbackCount++;
         if(vm.feedbackCount==feedback_number){
            swal(
             'submitted!',
             'Feedbacks have been submitted.',
             'success'
           )
         }
      
     }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
   }
   function fetchFeedback(){
      $http({
      method: 'GET',
      url:  getFeedbackAPI+vm.reviewID,
      headers: { 'Content-Type': 'application/json' }
    }).then(function successCallback(response) {
 
      if(response.data){
        var data = response.data;
        for(i in data){
         var feedback = data[i];
         for(j in vm.reviewers){
            var reviewer = vm.reviewers[j];
            if(reviewer.employee.id==feedback.feedback_giver){
               reviewer.feedback = feedback.feedback;
            }
         }
        }


       
      }
    }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });

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
            headers: { 'Content-Type': 'application/json' }
       }).then(function successCallback(response) {
    
         if(response.data){
           var data = response.data;
           //console.log(data);

           vm.reviewers = data;
           vm.reviewers.forEach(function(v){v.feedback=""});
           fetchFeedback();
            
          
         }
       }, function errorCallback(data, status, headers, config) {
         // called asynchronously if an error occurs
         // or server returns response with an error status.
       });
   }
    
}
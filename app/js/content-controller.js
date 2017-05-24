angular.module('content',[])
.controller('ContentController', ContentController);

function ContentController ($http,$routeParams,$translate,$rootScope) {
	var vm = this;
  var token = getCookie("token_django");

  var token_str = 'Bearer '+token;
  vm.token_str = token_str;
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
         headers: { 'Content-Type': 'application/json',
                  'Accept': 'application/json' ,
                  'Authorization': token_str }
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
      headers: { 'Content-Type': 'application/json',
                 'Accept': 'application/json' ,
                 'Authorization': token_str }
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
        console.log(data)
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
            console.log(project_data);
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
           console.log(vm.reviewers);
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
          // fetchFeedback();
            
          
         }
       }, function errorCallback(data, status, headers, config) {
         // called asynchronously if an error occurs
         // or server returns response with an error status.
       });
   }
    
}
angular.module('content',[])
.controller('ContentController', ContentController);

function ContentController ($scope,$location,$http,$routeParams,$translate,$rootScope) {
	var vm = this;
  vm.documentTypes = new Map();
  var token = getCookie("token_django");
 if(!token){
       $location.path( "/login/3/"+$routeParams.id);
       return;
 }
  var token_str = 'Bearer '+token;
  vm.token_str = token_str;
   vm.reviewID = $routeParams.id;
   
   vm.feedbackCount =0 ;
   vm.addFeedback = addFeedback;
   vm.redirectToEdit = redirectToEdit;
   vm.backToReview = backToReview;
   vm.canEditFeedback = canEditFeedback;
   vm.toggleEditFeedback = toggleEditFeedback;
   vm.editFeedback = editFeedback;
   vm.deleteFeedback = deleteFeedback;
   vm.feedbackEditState = false;
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
   vm.profile = getUserProfile()
   if(vm.reviewID){
      fetchReview();
      fetchReviewMember();
      getCurrentUserInfo();
      fetchFeedback();
      fetchDocumentType();
      fetchDocument();
   }
   function redirectToEdit(){
    $location.path( "/editReview/"+vm.reviewID);
   }
    function backToReview(){
      $location.path( "/" );
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
            //console.log(vm.userInfo);
          }
      
     }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }
  function canEditFeedback(giver){
    if (typeof giver == 'undefined')return false;
    if (giver.employee_email==vm.profile.email)return true;
    else return false;
  }
  function toggleEditFeedback(feedbackObj){
    feedbackObj.edit = true;
    vm.feedbackEditState = true;
    
  }
  function editFeedback(feedbackObj){
    feedbackObj.edit = false;
    vm.feedbackEditState = false;
    var feedback_giver = feedbackObj.feedback_giver
      var feedback = feedbackObj.feedback;
      var reviewID = feedbackObj.review;
      var data ={feedback:feedback,feedback_giver:feedback_giver,review:reviewID};
      $http({
         method: 'PATCH',
         url:  editFeedbackAPI+feedbackObj.id+"/",
         data:data,
         headers: { 'Content-Type': 'application/json',
                  'Accept': 'application/json' ,
                  'Authorization': token_str }
       }).then(function successCallback(response) {
        console.log(response)
      
     }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }
  function requestDeleteFeedback(feedbackObj){
      $http({
         method: 'DELETE',
         url:  editFeedbackAPI+feedbackObj.id+"/",
         headers: { 'Content-Type': 'application/json',
                  'Accept': 'application/json' ,
                  'Authorization': token_str }
       }).then(function successCallback(response) {
          console.log(response)
      
     }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }
  function deleteFeedback(feedbackObj){
      swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then(function () {
      for(var i = 0;i<vm.feedbackList.length;i++){
        if(vm.feedbackList[i].id ==feedbackObj.id){
          vm.feedbackList.splice(i,1);
          break;
        }
      }
      $scope.$apply()
      requestDeleteFeedback(feedbackObj);
      
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
        // console.log(response);
         location.reload();
        
      
     }, function errorCallback(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
   }
   function fetchDocumentType(){//getDocumentTypeAPI
     $http({
      method: 'GET',
      url:  getDocumentTypeAPI,
      headers: { 'Content-Type': 'application/json',
                  'Accept': 'application/json' ,
                  'Authorization': vm.token_str 
    }
    }).then(function successCallback(response) {
      
 
      if(response.data){
       var data = response.data;
       vm.documentTypes = new Map();
       console.log(data);
       for(i in data){
        vm.documentTypes.set(data[i].id,data[i].doctype_code);
       }
       console.log(vm.documentTypes)

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
      console.log(response)
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
          vm.feedbackList[i].edit = false;
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
  function fetchDocument(){
     $http({
      method: 'GET',
      url:  getReviewDocumentAPI+vm.reviewID,
      headers: { 'Content-Type': 'application/json',
                  'Accept': 'application/json' ,
                  'Authorization': vm.token_str 
    }
    }).then(function successCallback(response) {
      //console.log("GET documents")
      console.log(response)
 
      if(response.data){
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
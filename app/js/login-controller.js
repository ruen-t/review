

angular.module('login', ['datatables', 'ngResource'])
.controller('LoginController', LoginController);

var vm;

function LoginController ($routeParams,$resource,$translate,$http,$location) {
	vm = this;
  vm.routeParams = $routeParams;
	vm.http =$http
   vm.location = $location;
	vm.onSignIn = onSignIn;
	vm.requestDJangoToken = requestDJangoToken;
	vm.signOut = signOut;
  vm.loggedIn = false;
 
  var token = getCookie("token_django");
  if(token){
    vm.loggedIn = true;
  }
  
}

       



function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    //var client_id = "BufEoI2OhtOiVwCLpdrPFZrqXHO3Fd9Zk5xmY4mK";
    console.log("onSignIn")
    var client_id ="I2IAnOzO7QorjqfgXX4YbBUJ6w5ASt8w5qWcwbW1";
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    var authData = googleUser.getAuthResponse(true);
    console.log(authData);
    var data = {"grant_type": "convert_token", "client_id":client_id, "backend":"google-oauth2", "token":authData.access_token}
    var json_data = JSON.stringify(data);
    vm.requestDJangoToken(json_data);
    
    
  }


  function requestDJangoToken(json){
    console.log(json)
    vm.http({
              method: 'POST',
              url:  getJangoToken,
              data:json,
              headers: { 'Content-Type': 'application/json' }
            }).then(function successCallback(response) {
                console.log("success request Jango token");
                console.log(response);
                var today = new Date();
                var tomorrow = new Date()
                tomorrow.setDate(today.getDate()+1);
                //console.log(tomorrow);
                document.cookie = "token_django="+response.data.access_token+", expires="+today
               vm.loggedIn = true;
                console.log(document.cookie);
                console.log(getCookie("token_django"))
                if(vm.routeParams.state){
                  var state = parseInt(vm.routeParams.state);
                  switch(state){
                    case 0:
                      vm.location.path("/");
                      break;
                    case 1: 
                      vm.location.path("/addReview");
                      break;
                    case 2: 
                      var id =vm.routeParams.id;
                      vm.location.path("/editReview/"+id);
                      break;
                    case 3: 
                      var id =vm.routeParams.id;
                      vm.location.path("/content/"+id);
                      break;  


                  }
                  
                }
                
                
               
              }, function errorCallback(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
              });
  }

 function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.replace(",",";").split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function delete_cookie( name ) {
  console.log("delete cookie")
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
function signOut() {
  console.log("signOut")
          var auth2 = gapi.auth2.getAuthInstance();
          auth2.signOut().then(function() {
          console.log('User signed out.');
          });
          delete_cookie("token_django")
         vm.loggedIn = false;
        vm.location.path( "/login" );
    }


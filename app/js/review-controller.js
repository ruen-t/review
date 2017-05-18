var review =[
//{id:1,date:"2017-01-11T05:18:27",selected:true,shop:"BRAND",project:"CharaTV",development:"Check for bugs",type:"CDR",location:"AA3I",comment:"hello"},
];
angular.module('review', ['datatables', 'ngResource','ngMaterial','datatables.scroller'])
.controller('ReviewController', ReviewController)
.config(function($mdIconProvider) {
    $mdIconProvider
      .defaultIconSet('img/icons/sets/core-icons.svg', 24);
  })
.config(function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.delete = {};
  $httpProvider.defaults.headers.patch = {};
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

var hasSelected=false;
var scope;
function ReviewController($location,$timeout,$scope, $resource,$mdDialog,$mdMenu,$http) {
    var vm = this;
     scope = $scope;
    scope.totalDisplayed = 600;
    vm.hasSelected = hasSelected;
    vm.reviewSelect = reviewSelect;
    vm.checkSelected = checkSelected;
    vm.deleteReview = deleteReview;
    vm.fetchData = fetchData;
    vm.changeday = changeday;
    vm.sameDate = sameDate;
    vm.toggleDateFilter=toggleDateFilter;
    vm.datatableSearch  = datatableSearch;
    vm.gotoAddPage = gotoAddPage;
    vm.gotoEditPage = gotoEditPage;
    vm.gotoContentPage = gotoContentPage;
    vm.dtInstance = {};
    vm.dateFilter = false;

    vm.refreshFlag = false;
    vm.countRender = 0;
    vm.reviewDate;

        vm.dtOptions = {
            dom         : 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            columnDefs  : [
                {
                    // Target the id column
                    targets: 0,
                    width  : '50px',
                    sortable:false,
                },
                {
                    // Target the id column
                    targets: 1,
                    width  : '200px'
                },
                {
                    // Target the id column
                    targets: 2,
                    width  : '200px'
                },
                {
                    // Target the id column
                    targets: 3,
                    width  : '400px'
                },
                {
                    // Target the id column
                    targets: 4,
                    width  : '130px'
                },
                {
                    // Target the id column
                    targets: 5,
                    width  : '200px'
                },
                {
                    // Target the id column
                    targets: 6,
                    width  : '200px'
                },
                {
                    // Target the id column
                    targets: 7,
                    width  : '50px'
                },
                
            ],
             initComplete:function(){ 
             //init complete will be called twice after table is created and after table is fully loaded

                if(vm.countRender==0){
                    vm.fetchData();
                }

                vm.countRender++;
               // console.log(this)

                var api = this.api(),

                    searchBox = angular.element('body').find('#review_search');

                   // console.log(searchBox)

                // Bind an external input as a table wide search box
                if ( searchBox.length > 0 )
                {
                    //console.log("trigger event")
                    searchBox.on('keyup', function (event)
                    { 
                        
                       api.search(event.target.value).draw();
                        //console.log(event.target.value);
                    });
                }
                vm.changeday(0);
                
               /* this.on( 'page.dt', function () {
                  
                  scope.totalDisplayed+=30;
                  console.log("total: "+scope.totalDisplayed);
            } );*/
                //vm.totalDisplayed = 600;
                
           },
           //serverSide :true,
           //destroy:true,
           deferRender: true,
           processing: true,
            pagingType  : 'full_numbers',
            lengthMenu  : [[10, 30, 50,-1],[10, 30, 50,"All"]],
            pageLength  : 10,
            scrollY     : '450',
            language: {
         "emptyTable": '<img src="assets/ring.gif"  />',
           "zeroRecords": "No records to display",
            },
           
            //responsive  : true,
           // rowCallback : rowCallback,
           // processing : true,

        };

        vm.review=[];
        

   
   vm.openMenu= function () {
     
      $mdMenu.open();

    };
 function gotoAddPage(){
 // console.log("go add")
   $location.path( "/addReview" );
 }
 function gotoEditPage(){
  //console.log("go edit")
  var selectedID = getselectedReview();
  $location.path( "/editReview/"+selectedID );
 }
 function gotoContentPage(id){
  // console.log("go content:"+id)
  $location.path( "/content/"+id );

 }
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
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
function toLocal (date) {
  var local = new Date(date);
  local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return local.toJSON();
}

function toJSONLocal (date) {
  var local = new Date(date);
  local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
}
 function fetchData(){
  //console.log("fetch")
  var start = new Date();
   start.setDate(1);
  start.setMonth(start.getMonth()-2);
  var end = new Date();
   end.setDate(1);
  end.setMonth(end.getMonth()+2);
  var start_date_str = toJSONLocal(start);
  var end_date_str = toJSONLocal(end);
  console.log(start_date_str);
  console.log(end_date_str);

  
 /* $.ajax({
          type: "GET",
          url: getReviewAPI
      })
      .done(function(data) {
       
        if(data){

            vm.review=[];
            for (i in data){
              console.log(data[i])
                var managerArray=data[i].pm.concat(data[i].pdm)
                  vm.review.push({select:false,id:data[i].id,manager:managerArray,date:data[i].review_date_start,location:data[i].review_location,development:{development:data[i].development,shop:data[i].shop,title:data[i].review_title},type:data[i].review_type,reviewer:data[i].reviewer})
                    }

                   
                }
              $scope.$apply();  

      });*/
      var token = getCookie("token_django");
      if(!token){
       $location.path( "/login" );
       return;
     }
      var token_str = 'Bearer '+token;
      console.log(token_str);

      var date = start_date_str+"|"+end_date_str;
  $http({
              method: 'GET',
              url:  getReviewByDateAPI+date,
              //data:$.param({control_op:0}),
              headers: { 'Content-Type': 'application/json',
                          'Accept': 'application/json' ,
                         'Authorization': token_str }
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                //console.log(response);
                
                if(response.data){
                   //console.log(response.data)
                    var data = response.data;
                    vm.review=[];
                     for (i in data){
                    
                      if(!data[i].pm){
                        data[i].pm="";
                      } if(!data[i].pdm){
                        data[i].pdm = "";
                      }
                       var managerArray=data[i].pm.split(",").concat(data[i].pdm.split(","))
                      //console.log(managerArray)
                      //var manager = data[i].pm+","+data[i].pdm;
                       vm.review[i]={select:false,id:data[i].id,manager:managerArray,date:data[i].review_date_start,location:data[i].meetspace_name_en,development:data[i].development_code,title:data[i].review_title,type_en:data[i].revtype_name_en,type_jp:data[i].revtype_name_jp,reviewer:data[i].reviewer}
                    }

                   // console.log(vm.review)
                  //  vm.dtInstance.rerender();
                   // vm.changeday(0)
                }
                 //console.log("data is loaded")
                
               // $scope.$apply();
              }, function errorCallback(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
              });
} 
function toggleDateFilter(){
  vm.dateFilter = !vm.dateFilter
  if(!vm.dateFilter){
   $("#reviewTable").DataTable().search("",true,true).draw();
  }else{
     
    vm.changeday(0)
  }
  console.log(vm.dateFilter)
}
function changeday(day){
  //console.log(day)
 if(!vm.dateFilter)return;
  var currentDate;
//console.log(tomorrow.toLocaleDateString())
  if(vm.reviewDate){
    var currentDate = new Date(vm.reviewDate)
   // console.log(currentDate.toLocaleDateString())
   // dateObj.setDate((new Date(vm.reviewDate)) + 1000*3600*24)
    currentDate.setDate(currentDate.getDate()+day);
    //console.log(currentDate.toLocaleDateString())
  
  }else{
    currentDate=new Date();
  }
  
  vm.reviewDate=currentDate;
  datatableSearch(currentDate)
}
function sameDate(date1,date2){
  var d1 = new Date(date1);
  var d2 = new Date(date2);
 // console.log(d1.getTime() === d2.getTime())
  return d1.getTime() === d2.getTime();
}
function datatableSearch(val){
 // console.log("SearchDate")
  //console.log(val)
  var dateObj = new Date(val);
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
var day = dateObj.getDate();
var year = dateObj.getFullYear();
var monthStr = ""
var dayStr = ""
if(month<10){
  monthStr = "0"+month
}else{
  monthStr = month;
}
if(day<10){
dayStr = "0"+day;
}else{
  dayStr=day;
}
var newdate = year + "-" + monthStr + "-" + dayStr;
 // console.log("searchDate:"+newdate)
  $("#reviewTable").DataTable().search(newdate,true,true).draw();
 // console.log($("#reviewTable"))

}
function deleteReview(){///reviewtoolapi/review/{id}/delete/
  var id = getselectedReview();
  //console.log(id);
  //console.log(deleteAPI)
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
  }).then(function () {
    $.ajax({
    url: deleteAPI+id,
    type: 'DELETE',
    success: function(result) {
        // Do something with the result
        vm.fetchData();
                swal(
                  'Deleted!',
                  'Your file has been deleted.',
                  'success'
                )
      }
    });

  /*  $http({
              method: 'DELETE',
              url: deleteAPI+id,
              //data:$.param({control_op:0}),
              
            }).then(function successCallback(response) {
                vm.fetchData();
                swal(
                  'Deleted!',
                  'Your file has been deleted.',
                  'success'
                )
              }, function errorCallback(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
        });*/
   } 
    
  )
  
  

}
function checkSelected(){
  return vm.hasSelected;
}
function getselectedReview(){
  for(var i =0;i<vm.review.length;i++){
    
   if(vm.review[i].selected)return vm.review[i].id;
  }
  return -1
}
function reviewSelect(id){
  //console.log(id)
  var selected_review = getReview(id);
  if(!selected_review){
    //console.log("no")
    vm.hasSelected = false;
  }else{
    //console.log(selected_review.id)
    var check =!selected_review.selected;
    clearSelectReview();
    selected_review.selected = check;
    vm.hasSelected = check;
    //console.log(hasSelected)

  }

}
function clearSelectReview(){
  for(var i =0;i<vm.review.length;i++){
   vm.review[i].selected=false;
  }
}
function getReview(id){
  
  for(var i =0;i<vm.review.length;i++){
    if(vm.review[i].id==id)return vm.review[i];
  }
  return null;
}  
   
}


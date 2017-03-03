var user = {
  title: 'Developer',
  email: 'ipsum@lorem.com',
  firstName: 'Angela',
  lastName: 'Puspitasari',
  company: 'Google',
  address: '1600 Amphitheatre Pkwy',
  city: 'Mountain View',
  state: 'CA',
  biography: 'Loves kittens, snowboarding, and can type at 130 WPM.\n\nAnd rumor has it she bouldered up Castle Craig!',
  postalCode: '94043'
    };
var states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' + 'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' + 'WY').split(' ').map(function(states) {
        return {abbrev: states};
      });

var types = ('PSR RR CDR').split(' ').map(function(types){
  return {abbrev: types};
});

var shops = ('SKY VP WITH BRAND').split(' ').map(function(shops){
  return {abbrev: shops};
});

var levels = ('PM PDM DEV').split(' ').map(function(levels){
  return {abbrev: levels};
});

var ReviewModifyController =['$resource','$translate', function ($resource,$translate) {
    var vm = this;
    vm.message = "hello this is a add page";
    vm.user = user;
    vm.states = states;
    vm.types = types;
    vm.shops = shops;
    vm.levels = levels;
  }]

 angular.module('reviewmodify', ['datatables', 'ngResource'])
.controller('ReviewModifyController', ReviewModifyController)
.config(function($mdThemingProvider) {

    // Configure a dark theme with primary foreground yellow

    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();

  });






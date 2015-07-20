// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('gisMobile', ['ionic', 
                             'base64', 
                             'ngResource', 
                             'gis.xmlparser',
                             'gis.pouchdb',
// @if NODE_ENV='development'
                             'ngCordovaMocks'
// @endif

// @if NODE_ENV='production'
                             'ngCordova'
// @endif
                            ])


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider,  $urlRouterProvider){
  $stateProvider
  .state('home', {
    url: '/',
    controller: 'HomeCtrl',
    templateUrl: 'app/home/home.html'
  });

  $urlRouterProvider.otherwise('/');
});

// @if NODE_ENV='production'
L.Icon.Default.imagePath = 'img';
// @endif
angular.module('gisMobile').config(function($stateProvider){
  $stateProvider
  .state('settings', {
    url: '/settings',
    controller: 'SettingsCtrl',
    templateUrl: 'app/settings/settings.html'
  });
});
angular.module('gisMobile').config(function($stateProvider){
  $stateProvider
  .state('indicators', {
    url: '/indicators',
    controller: 'IndicatorsCtrl',
    templateUrl: 'app/indicators/indicators.html'
  });
});
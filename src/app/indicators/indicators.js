angular.module('gisMobile').config(function($stateProvider){
  $stateProvider
  .state('indicators', {
    url: '/indicators',
    controller: 'IndicatorsCtrl',
    templateUrl: 'app/indicators/indicators.html'
  })
  .state('indicatorsByCat', {
    cache: false,
    url: '/cat/indicators/:cat',
    controller: 'IndicatorsCtrl',
    templateUrl: 'app/indicators/indicators.html'
  });
});
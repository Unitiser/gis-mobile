angular.module('gisMobile').config(function($stateProvider){
  $stateProvider
  .state('indicator', {
    url: '/indicator/:id',
    controller: 'IndicatorCtrl',
    templateUrl: 'app/indicator/indicator.html'
  })
  .state('indicatorByCat', {
    url: '/cat/indicator/:cat/:id',
    controller: 'IndicatorCtrl',
    templateUrl: 'app/indicator/indicator.html'
  });
});

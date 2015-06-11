angular.module('gisMobile').config(function($stateProvider){
  $stateProvider
  .state('indicator', {
    url: '/indicator',
    controller: 'IndicatorCtrl',
    templateUrl: 'app/indicator/indicator.html'
  })
  .state('indicatorId', {
    url: '/indicator/:id',
    abstract: true,
    templateUrl: 'app/indicator/indicatorId.html'
  })
  .state('indicatorId.tabs', {
    url: '/indicator/:id/tabs',
    views: {
        'indicator-graph': {
            templateUrl: 'app/indicator/indicatorId.graph.html'
        },
        'indicator-table': {
            templateUrl: 'app/indicator/indicatorId.table.html'
        },
        'indicator-map': {
            templateUrl: 'app/indicator/indicatorId.map.html'
        }
    }
  });
});
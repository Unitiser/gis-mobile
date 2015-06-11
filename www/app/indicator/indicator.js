angular.module('gisMobile').config(function($stateProvider){
  $stateProvider
  .state('indicator', {
    url: '/indicator/:id',
    abstract: true,
    templateUrl: 'app/indicator/indicator.html'
  })
  .state('indicator.map', {
    url: '/map',
    views: {
      'map': {
        templateUrl: 'app/indicator/indicator.map.html'
      }
    }
  })
  .state('indicator.graph', {
    url: '/graph',
    views: {
      'graph': {
        templateUrl: 'app/indicator/indicator.graph.html'
      }
    }
  })
  .state('indicator.table', {
    url: '/table',
    views: {
      'table': {
        templateUrl: 'app/indicator/indicator.table.html'
      }
    }
  });
});
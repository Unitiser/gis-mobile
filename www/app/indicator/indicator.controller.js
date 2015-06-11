angular.module('gisMobile').controller('IndicatorCtrl', function($scope, $state){
    $scope.indicators = [{
        id: 'club',
        name: 'Club',
        icon: 'ion-wineglass'
    },{
        id: 'pizza',
        name: 'Pizzeria',
        icon: 'ion-pizza'
    },{
        id: 'coffee',
        name: 'Cafée',
        icon: 'ion-coffee'
    },{
        id: 'icecream',
        name: 'Bar laitier',
        icon: 'ion-icecream'
    },{
        id: 'bar',
        name: 'Bar',
        icon: 'ion-beer'
    },{
        id: 'sport',
        name: 'Centre sportif',
        icon: 'ion-ios-football'
    }]

    $scope.selectIndicator = function(){
        console.log('Trying to change the state?');
        $state.go('indicatorId.tabs', {id: "test"});
    }
});
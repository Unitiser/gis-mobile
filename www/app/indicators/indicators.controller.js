angular.module('gisMobile').controller('IndicatorsCtrl', function($scope, $state, Indicator){
    $scope.indicators = Indicator.indicators;
});
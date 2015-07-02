angular.module('gisMobile').controller('IndicatorsCtrl', function($scope, $state, Indicator){
    if($state.params.cat){
        Indicator.getByCategory($state.params.cat)
        .then(function(indicators){
            $scope.indicators = [];
            _.each(indicators, function(ind){
                $scope.indicators.push({
                    id: ind.name,
                    name: ind.label,
                    url: '/cat/indicator/' + $state.params.cat + '/' + ind.id,
                    icon: 'ion-earth'
                });
            });
        });
    }
});
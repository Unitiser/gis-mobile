angular.module('gisMobile').controller('IndicatorsCtrl', function($scope, $state, Indicator, data){
    if($state.params.cat){
        data.getIndicators($state.params.cat, function(indicators){
            console.log('Indicator', indicators);
            $scope.indicators = [];
            _.each(indicators, function(ind){
                $scope.indicators.push({
                    id: ind.name,
                    name: ind.label,
                    url: '/cat/indicator/' + $state.params.cat + '/' + ind.name,
                    icon: 'ion-earth'
                });
            });
        });
    }else{
        $scope.indicators = Indicator.indicators;
    }
});
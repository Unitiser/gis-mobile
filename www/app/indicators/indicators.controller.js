angular.module('gisMobile').controller('IndicatorsCtrl', function($scope, $state, Indicator, data){
    if($state.params.cat){
        var t1 = new Date().getTime();

        data.getIndicators($state.params.cat, function(indicators){
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
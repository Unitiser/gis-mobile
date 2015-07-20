angular.module('gisMobile').controller('IndicatorsCtrl', function($scope, $state, Indicator, $rootScope, $cordovaNetwork){
    function addIndicator(indicator){
        $scope.indicators.push({
            id: indicator.id,
            name: indicator.label,
            url: '/cat/indicator/' + $state.params.cat + '/' + indicator.id,
            icon: 'ion-earth'
        });
    }
    
    if($state.params.cat){
        var getByCategory;
        if($cordovaNetwork.isOnline())
            getByCategory = Indicator.getByCategory;
        else
            getByCategory = Indicator.getOfflineByCategory;

        getByCategory($state.params.cat)
        .then(function(indicators){
            $scope.indicators = [];
            _.each(indicators, addIndicator);
        });
    }
    

    $rootScope.toggleMenu = false;
});
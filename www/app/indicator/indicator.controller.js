angular.module('gisMobile').controller('IndicatorCtrl',  function($scope, $state, $ionicNavBarDelegate, Indicator){
    var tabTitles = {
        map : 'Carte',
        graph : 'Graphique',
        table : 'Tableau'
    }

    $scope.setTab = function(tab){
        $scope.tab = tab;
        $ionicNavBarDelegate.title(Indicator.getIndicator($state.params.id).name + " - " + tabTitles[tab]);
    }

    $scope.setTab('map');
});
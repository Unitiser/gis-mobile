angular.module('gisMobile').controller('IndicatorCtrl',  function($scope, $state, $ionicNavBarDelegate, Indicator, $ionicSideMenuDelegate, $ionicPlatform){
    var tabTitles = {
        map : 'Carte',
        graph : 'Graphique',
        table : 'Tableau'
    }
    var map;

    $scope.setTab = function(tab){
        $scope.tab = tab;
        $ionicNavBarDelegate.title(Indicator.getIndicator($state.params.id).name + " - " + tabTitles[tab]);
    }

    $scope.init = {
        map: function(){
            console.log('Initializing map');
            //Load leaflet
            map = L.map('gis-map', { zoomControl:false }).setView([45.88451167585413, -72.50152587890625], 10);
            // add an OpenStreetMap tile layer
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
            map.attributionControl.setPrefix('');
        },
        graph: function(){
            console.log('Initializing graph');
        },
        table: function(){
            console.log('Initializing table');
        }
    }

    $scope.setTab('map');
});
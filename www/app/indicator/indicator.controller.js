angular.module('gisMobile').controller('IndicatorCtrl',  function(xmlparser, $scope, $state, $ionicNavBarDelegate, Indicator, $ionicSideMenuDelegate, $ionicPlatform, data){
    var tabTitles = {
        map : 'Carte',
        graph : 'Graphique',
        table : 'Tableau'
    }
    var map;
    $scope.regions = [];
    $scope.pieData = [{
            value: 0,
            label: "Homme",
            color: '#1976d2',
            highlight: '#1565c0'
        },{
            value: 0,
            label: "Femme",
            color: '#ef5350',
            highlight: '#f44336'
        }];
    $scope.barData = {
        labels: [],
        datasets: [{
            label: "Homme",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: []
        },{
            label: "Femme",
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data: []
        }

        ]
    };

    $scope.barTotalData = {
        labels: [],
        datasets: [{
            label: "Total",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: []
        }
        ]
    };


    $scope.setTab = function(tab){
        $scope.tab = tab;
        var indicatorName;
        if($state.params.cat){
            indicatorName = data.getIndicatorByName($state.params.id).label;
        }else{
            indicatorName = Indicator.getIndicator($state.params.id).name;
        }

        $ionicNavBarDelegate.title(indicatorName + " - " + tabTitles[tab]);
    }

    $scope.init = {
        map: function(){
            console.log('Initializing map');
            //Load leaflet
            map = L.map('gis-map', { zoomControl:false }).setView([45.88451167585413, -72.50152587890625], 10);
            // add an OpenStreetMap tile layer
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
            map.attributionControl.setPrefix('');
            data.getIndicatorByRegion($state.params.id, addRegion);
        },
        graph: function(){
            console.log('Initializing graph');

            var ctx = document.getElementById("pie").getContext("2d");
            var pieChart = new Chart(ctx).Pie($scope.pieData);

            var ctx1 = document.getElementById("bar").getContext("2d");
            var barChart = new Chart(ctx1).Bar($scope.barData);

            var ctx2 = document.getElementById("barTotal").getContext("2d");
            var barTotalChart = new Chart(ctx2).Bar($scope.barTotalData);
        },
        table: function(){
            console.log('Initializing table');
        }
    }


    function addRegion(region, legend){
        $scope.legend = legend;
        $scope.regions.push(region);

        $scope.pieData[0].value += region.men*1;
        $scope.pieData[1].value += region.women*1;

        $scope.barData.labels.push(region.label);
        $scope.barData.datasets[0].data.push(region.men);
        $scope.barData.datasets[1].data.push(region.women);

        $scope.barTotalData.labels.push(region.label);
        $scope.barTotalData.datasets[0].data.push(region.total);

        for (var i = region.polygon.length - 1; i >= 0; i--) {
            var polygon = new L.Polygon(region.polygon[i], {
                fill: true,
                fillOpacity: 0.6,
                color: 'black',
                fillColor: getColor(region.total, legend),
                weight: 1
            });
            var popupMsg = region.label + "<br/> Homme: " + region.men + " Femme: " + region.women + " Total: " + region.total;
            polygon.bindPopup(popupMsg);
            map.addLayer( polygon);
        };
    }


    function getColor(value, legend){
        for(var i = 0; i < legend.length; i++){
            if((value * 1) >= legend[i].min &&
                (value * 1) < legend[i].max ){
                return legend[i].color.replace('0x', '#');
            }
        }
    }

    $scope.setTab('map');
});

data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};
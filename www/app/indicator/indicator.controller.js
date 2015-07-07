angular.module('gisMobile').controller('IndicatorCtrl',  function(xmlparser, $scope, $state, $ionicNavBarDelegate, Indicator, Geometry){
    var tabTitles = {
        map : 'Carte',
        graph : 'Graphique',
        table : 'Tableau'
    }
    var map, indicator, geometry;
    var Log = Logger.get('IndicatorCtrl');

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
        }]
    };


    $scope.setTab = function(tab){
        $scope.tab = tab;
        if(indicator)
            $ionicNavBarDelegate.title(indicator.label + " - " + tabTitles[tab]);
        else{
            $scope.getData().then(function(){
                $ionicNavBarDelegate.title(indicator.label + " - " + tabTitles[tab]);
            });
        }
    }

    $scope.getData = function(){
        return Indicator.get($state.params.id)
        .then(function(ind){
            console.log(ind);
            indicator = ind;
            return Geometry.get();
        }).then(function(geo){
            geometry = geo;
            $scope.legend = _.find(indicator.legend, { for: 'map'} );
            console.log($scope.legend);
            _.each(geometry.domainSet.MultiSurface, addZone);
        });
    }

    $scope.init = {
        map: function(){
            Logger.info('Initializing map');
            //Load leaflet
            map = L.map('gis-map', { zoomControl:false }).setView([45.88451167585413, -72.50152587890625], 10);
            // add an OpenStreetMap tile layer
            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            map.attributionControl.setPrefix('');
        },
        graph: function(){

            Logger.info('Initializing graph');

            // var ctx = document.getElementById("pie").getContext("2d");
            // var pieChart = new Chart(ctx).Pie($scope.pieData, {animation: false});

            // var ctx1 = document.getElementById("bar").getContext("2d");
            // var barChart = new Chart(ctx1).Bar($scope.barData);

            // var ctx2 = document.getElementById("barTotal").getContext("2d");
            // var barTotalChart = new Chart(ctx2).Bar($scope.barTotalData);
        },
        table: function(){
            Logger.info('Initializing table');
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
    }

    function addZone(zone){
        //Get indicator info and map legend
        var legend = $scope.legend;
        var zoneValues = _.find(indicator.value, { z : zone.id});
        
        //Add zone to data table
        $scope.regions.push({
            label: zone.name.content,
            men: zoneValues.men,
            women: zoneValues.women
        });

        //Build popup message
        var popupMsg = zone.name.content + '<br/>';
        for (var i = indicator.param.length - 1; i >= 0; i--) {
            popupMsg += indicator.param[i].content + " : " + zoneValues[indicator.param[i].name] + " ";
        };
        popupMsg += '<br/>' + 'Description : ' + zone.description.content;

        //Add zone polygons
        for (var i = zone.Polygon.length - 1; i >= 0; i--) {
            var polygon = []
            polygon.push(zone.Polygon[i].exterior.posList.content);
            
            if(zone.Polygon[i].interior){
                for (var j = zone.Polygon[i].interior.length - 1; j >= 0; j--) {
                    polygon.push(zone.Polygon[i].interior[j].posList.content);
                };
            }

            var leafPoly = new L.Polygon(polygon,{
                fill: true,
                fillOpacity: 0.6,
                color: 'black',
                fillColor: getColor(zoneValues[legend.value], legend),
                weight: 1
            });
            leafPoly.bindPopup(popupMsg);
            map.addLayer(leafPoly);
        };
    }


    function getColor(value, legend){
        for(var i = 0; i < legend.item.length; i++){
            if((value * 1) >= legend.item[i].min &&
                (value * 1) < legend.item[i].max ){
                return legend.item[i].color.replace('0x', '#');
            }
        }
    }

    $scope.setTab('map');
});
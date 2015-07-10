angular.module('gisMobile').controller('IndicatorCtrl',  function(xmlparser, $scope, $state, $ionicNavBarDelegate, Indicator, Geometry, Graph){
    var tabTitles = {
        map : 'Carte',
        graph : 'Graphique',
        table : 'Tableau'
    }
    var map, indicator, geometry;
    var Log = Logger.get('IndicatorCtrl');

    $scope.regions = [];

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
            _.each(indicator.marker.item, addMarker);
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

            $scope.charts = [];

            _.forEach(indicator.legend, function(legend, index){
                if(legend.for == 'map') return; //Skip map...
                $scope.charts.unshift({
                    for: legend.for,
                    data: Graph.getConfig(indicator, geometry, legend),
                    title: legend.title
                });
            });
        },
        table: function(){
            Logger.info('Initializing table');
        }
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

    function addMarker(item){
        var ptn = Geometry.changeProjection(indicator.marker.srcName, item.content).split(',');
        var leafMarker = L.marker(ptn).addTo(map);
        leafMarker.bindPopup(item.label);
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
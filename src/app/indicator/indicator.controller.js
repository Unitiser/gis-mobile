angular.module('gisMobile')
.controller('IndicatorCtrl',  function(xmlparser, $scope, $state, $ionicNavBarDelegate, $ionicSideMenuDelegate, 
                                        Indicator, Geometry, Graph, $rootScope, $ionicPopup, Alert){
    var tabTitles = {
        map : 'Carte',
        graph : 'Graphique',
        table : 'Tableau'
    }
    var Log = Logger.get('IndicatorCtrl');
    var map, indicator, geometry;
    var status = {};
    var markers = [];

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
            indicator = ind;
            return Geometry.get();
        }).then(function(geo){
            geometry = geo;
            $scope.$emit('dataReady');
        });
    }

    $scope.init = {
        map: function(){
            Log.info('Initializing map');
            //Load leaflet
            map = L.map('gis-map', { zoomControl:false }).setView([45.88451167585413, -72.50152587890625], 10);
            // add an OpenStreetMap tile layer
            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            map.attributionControl.setPrefix('');
            $scope.$emit('mapReady');
        },
        graph: function(){
            if(!status['graphReady']){
                Log.info('Initializing graph');

                $scope.charts = [];

                _.forEach(indicator.legend, function(legend, index){
                    if(legend.for == 'map') return;
                    $scope.charts.unshift({
                        for: legend.for,
                        data: Graph.getConfig(indicator, geometry, legend),
                        title: legend.title
                    });
                });
                status['graphReady'] = true;
            }
        },
        table: function(){
            Log.info('Initializing table');
        }
    }

    $scope.$on('mapReady', function(){ Log.info('Map is ready'); status['mapReady'] = true; addDataToMap(); });
    $scope.$on('dataReady', function(){ Log.info('Data is ready'); status['dataReady'] = true; addDataToMap(); });
    $scope.toggleMarker = function(){
        $scope.showMarker = !$scope.showMarker;
        if($scope.showMarker){
            return showMarkers();
        }
        return hideMarkers();
    }

    function addDataToMap(){
        if(status['mapReady'] && status['dataReady']){
            $scope.legend = _.find(indicator.legend, { for: 'map'} );
            _.each(geometry.domainSet.MultiSurface, addZone);
            _.each(indicator.marker.item, addMarker);
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
        var leafMarker = L.marker(ptn);
        leafMarker.bindPopup(item.label);
        markers.push(leafMarker);
    }

    function hideMarkers(){
        Log.info('Hiding markers');
        _.forEach(markers, function(marker){
            map.removeLayer(marker);
        });
    }

    function showMarkers(){
        Log.info('Showing markers');
        _.forEach(markers, function(marker){
            map.addLayer(marker);
        });
    }

    function toggleMarker(){
        if(markerOpacity)
            markerOpacity = 0;
        else
            markerOpacity = 1;
    }


    function getColor(value, legend){
        for(var i = 0; i < legend.item.length; i++){
            if((value * 1) >= legend.item[i].min &&
                (value * 1) < legend.item[i].max ){
                return legend.item[i].color.replace('0x', '#');
            }
        }
    }

    $rootScope.toggleMenu = function(){
        $scope.isMenuVisible = !$scope.isMenuVisible;
    }
    $scope.toggleMenu = $rootScope.toggleMenu;

    //Add alerts
    $scope.addAlert = function(){
        var popupScope = $rootScope.$new(true);
        popupScope.type = [{
            label : 'le total',
            value : 'totalParam'
        },{
            label : 'la valeur',
            value : 'zoneParam'
        }];

        popupScope.comparator = [{
            label : 'est égal à',
            value : 'isEqual'
        },{
            label : 'est plus grand que',
            value : 'isGreater'
        },{
            label : 'est plus petit que',
            value : 'isSmaller'
        },{
            label : 'est entre',
            value : 'isBetween'
        }];

        popupScope.param = [];
        _.forEach(indicator.param, function(param, index){
            if(param.type == 'Integer') popupScope.param.push({
                label: param.content,
                value: param.name
            });
        });

        popupScope.zone = [];
        _.forEach(geometry.domainSet.MultiSurface, function(zone, index){
            popupScope.zone.push({
                label : zone.name.content,
                value : zone.id
            });
        });

        //Set some defaults value
        popupScope.alert = {
            type: 'totalParam',
            param: _.first(popupScope.param).value,
            comparatorType: 'isEqual'
        }

        var myPopup = $ionicPopup.show({
            templateUrl: 'app/indicator/alert.popup.html',
            title: 'Ajouter une alerte',
            scope: popupScope,
            buttons: [{ 
                text: 'Annuler' 
            },{
                text: '<b>Confirmer</b>',
                type: 'button-positive',
                onTap: function(e) {
                    var alert = popupScope.alert;
                    var areRequiredFieldTaken = !!alert.type && !!alert.comparatorType && !!alert.param && !!alert.comparatorValue1;
                    var areNumericValueValid = !isNaN(alert.comparatorValue1);
                    
                    if(alert.type == 'zoneParam'){
                        areRequiredFieldTaken = areRequiredFieldTaken && alert.zone;
                    }
                    if(alert.comparatorType == 'isBetween'){
                        console.log('hello?');
                        areNumericValueValid = areNumericValueValid && !isNaN(alert.comparatorValue2);
                        areRequiredFieldTaken = areRequiredFieldTaken && !!alert.comparatorValue2;
                    }
                    if (!areRequiredFieldTaken || !areNumericValueValid) {
                        //don't allow the user to close unless he enters wifi password
                        popupScope.areRequiredFieldTaken = !areRequiredFieldTaken;
                        popupScope.areNumericValueValid = !areNumericValueValid;
                        e.preventDefault();
                    } 
                    else { 
                        return alert; 
                    }
                }
            }]
        });
        myPopup.then(function(alert) {
            if(!alert) return;
            var comparator = alert.comparatorType + ' ' + alert.comparatorValue1 + (alert.comparatorType == 'isBetween' ? ',' + alert.comparatorValue2 : '');
            var newAlert = Alert.create(alert.type, comparator, $state.params.id, alert.param, alert.zone);
            console.log(newAlert.serialize());
            newAlert.isThrown().then(function(isThrown){
                console.log(isThrown);
            });
        });
    }

    $scope.setTab('map');
});
angular.module('gisMobile').service('data', function($http, localStorage){
    var data = {zones:{}, geometry: {}};
    var cache;
    var catCache = {};
    var indicatorCache = {};
    var parser = new DOMParser();
    var apiUrl;
    var myGeometry;
    var catListURL = 'lib/xmlDocuments/indicator.xml';


    //Definition of the projection that will be used
    proj4.defs("EPSG:32188","+proj=tmerc +lat_0=0 +lon_0=-73.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
    proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs ");



    function readDescription(){
        var infoNodes = cache.getElementsByTagName("info");
        for(var i = 0; i < infoNodes.length; i++){
            data[infoNodes[i].attributes['name'].nodeValue] = infoNodes[i].innerHTML;
        }
    }

    function readLegend(){
        var itemNodes = cache.getElementsByTagName("item");
        data.legend = [];
        for(var i = 0; i < itemNodes.length; i++){
            data.legend.push({
                min: itemNodes[i].attributes['min'].nodeValue,
                max: itemNodes[i].attributes['max'].nodeValue,
                label: itemNodes[i].attributes['label'].nodeValue,
                color: itemNodes[i].attributes['color'].nodeValue
            });
        }
    }

    function readByRegion(cb){
        readLegend();
        var zoneNodes = cache.getElementsByTagName("zone");
        var valueNodes = cache.getElementsByTagName("value");
        var compNodes = cache.getElementsByTagName("composition");
        readRegion(compNodes, valueNodes, zoneNodes, compNodes.length - 1, cb);
    };

    function readRegion(compNodes, valueNodes, zoneNodes, i, cb){
            var region = {};
            
            region.id = compNodes[i].attributes['zone'].nodeValue;
            region.composition =  compNodes[i].attributes['value'].nodeValue;
            region.men = valueNodes[i].attributes['men'].nodeValue;
            region.women = valueNodes[i].attributes['women'].nodeValue;
            region.total = valueNodes[i].attributes['total'].nodeValue;
            region.label = zoneNodes[i].attributes['label'].nodeValue;
            
            localStorage.get(region.id)
            .then(function(polygon){   //Geometry exists
                region.polygon = polygon.polygon;
                cb(region, data.legend);
            }).catch(function(err){ // Geometry doesnt exist
                //create geometry
                var polygon = { 
                    _id: region.id,
                    polygon: readPolygons(zoneNodes[i].getElementsByTagName('Polygon'))
                }
                localStorage.put(polygon);
                console.log('Adding new polygon');
                region.polygon = polygon.polygon;
                cb(region, data.legend);
            });
            if(i>0){
                readRegion(compNodes, valueNodes, zoneNodes, i-1, cb);
            }
    }

    function readPolygons(polygons){
        var polys = [];
        for (var i = polygons.length - 1; i >= 0; i--) {
            var poly = [];
            var outer = polygons[i].getElementsByTagName('outerBoundaryIs');
            var inner = polygons[i].getElementsByTagName('innerBoundaryIs');
            var j;
            for (j = outer.length - 1; j >= 0; j--) {
                poly.push(readRing(outer[j]));
            };

            for (j = inner.length - 1; j >= 0; j--) {
                poly.push(readRing(inner[j]));
            };
            polys.push(poly);
        };
        return polys;
    }

    function readRing(ring){
        var coords = ring.getElementsByTagName('coordinates')[0].textContent;

        var coordCouples = coords.split(' ');
        var array = [];
        for (var j = coordCouples.length - 1; j >= 0; j--) {
            array.push(
                toLeafletPoint(
                    changeProjection(
                        coordCouples[j].split(','))));
        };
        return array;
    }

    function changeProjection(point){
        return proj4('EPSG:32188','EPSG:4326', point);
    }

    function toLeafletPoint(point){
        return new L.LatLng(point[1], point[0]);
    }

    var service = {
        getByRegion: function(cb){
            if(cache){
                if(cache == 'loading'){
                    setTimeout(function() {
                        service.getByRegion(cb);
                    }, 200);
                }else{
                    readByRegion(cb);
                }
            }else{
                cache = 'loading';
                var t1 = (new Date()).getTime();
                $http.get(apiUrl)
                .success(function(rawXml){
                    cache = parser.parseFromString(rawXml, 'text/xml');
                    readByRegion(cb);
                    var t2 = (new Date()).getTime();
                    console.log('Total time: ' + (t2-t1));
                })
                .error(function(err){
                    console.log(err);
                });
            }
        },
        getIndicatorByRegion: function(indicator, cb){
            var url = indicatorCache[indicator].url;
            if(cache && apiUrl == url){
                service.getByRegion(cb);
            }else{
                cache = false;
                apiUrl = url;
                // data = {};
                service.getByRegion(cb);
            }
        },
        getDescription: function(indicator, cb){

        },
        getIndicators: function(cat, cb){
            var category = catCache[cat];
            var indicators = category.getElementsByTagName('indicator');
            var result = [];
            for (var i = indicators.length - 1; i >= 0; i--) {
                var indicator = {
                    name: indicators[i].getElementsByTagName('name')[0].textContent,
                    label: indicators[i].getElementsByTagName('label')[0].textContent,
                    version: indicators[i].getElementsByTagName('version')[0].textContent,
                    url: indicators[i].getElementsByTagName('url')[0].textContent
                };
                result.push(indicator);
                indicatorCache[indicator.name] = indicator;
            };
            cb(result);
        },
        getIndicatorByName: function(name){
            return indicatorCache[name];
        },
        getCategories: function(cb){
            $http.get(catListURL)
            .success(function(rawIndicator){
                var indicator = parser.parseFromString(rawIndicator, 'text/xml');
                var categories = indicator.getElementsByTagName('category');
                var result = [];
                for (var i = categories.length - 1; i >= 0; i--) {
                    var cat = {
                        name: categories[i].attributes['name'].nodeValue,
                        label: categories[i].attributes['label'].nodeValue
                    };
                    result.push(cat);
                    catCache[cat.name] = categories[i];
                };
                cb(result);
            })
            .error(function(err){
                console.log('Uh oh', err);
            });
        }
    };

    return service;
});
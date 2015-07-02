angular.module('gisMobile').service('Geometry', function(localStorage, xmlparser, STRUCTURE_URL, STRUCTURE_JSON, GEOMETRY_JSON){
    //Source proj
    proj4.defs("EPSG:32188","+proj=tmerc +lat_0=0 +lon_0=-73.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
    //Destination proj
    proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs ");

    //Load geometry
    function load(){
        //Hook posList call back to GEOMETRY_JSON
        GEOMETRY_JSON.domainSet.MultiSurface.Polygon.exterior.posList.callback = processPosList;
        GEOMETRY_JSON.domainSet.MultiSurface.Polygon.interior.posList.callback = processPosList;

        return localStorage.getGeometry()
        .then(function(geo){ //If we can find the geometry object, return it
            return geo;
        })
        .catch(function(e){ //If not get the url from structure if it exists
            if(e.name != 'not_found') return e;
            return localStorage.getStructure()
            .then(function(struct){ return struct.geometry; })
            .catch(function(){ //If structure doesnt exist load it
                if(e.name != 'not_found') return e;

                return xmlparser.readFile(STRUCTURE_URL, STRUCTURE_JSON)
                .then(function(structure){
                    localStorage.saveStructure(structure);
                    return structure.geometry;
                });
            }).then(function(geometry){ // Finally, get geometry from url
                return xmlparser.readFile(geometry.url, GEOMETRY_JSON)
                .then(function(geo){
                    localStorage.saveGeometry(geo);
                    return geo;
                });
            });
        });
    }
    
    //Change projection
    function changeProjection(point){
        return proj4('EPSG:32188','EPSG:4326', point);
    }

    //Convert into leaflet poin
    function toLeafletPoint(point){
        return new L.LatLng(point[1], point[0]);
    }

    //Process posList (Split it, change the projection, convert to leaflet point)
    function processPosList(posListNode){
        var rawPos = posListNode.content.trim().split(' ');
        var result = [];
        for (var i = rawPos.length - 1; i >= 0; i--) {
            result.push(toLeafletPoint(changeProjection(rawPos[i].split(','))));
        };
        // console.log(result);
        posListNode.content = result;
        return result;
    }

    //Get geometry
    function get(){
        return load();
    }

    //Validate version
    function validate(){
        var localVersion;
        var structVersion;
        return localStorage
        .getGeometry()
        .then(function(geo){
            localVersion = geo.version.content;
            return localStorage.getStructure()
            .catch(function(e){
                return xmlparser.readFile(STRUCTURE_URL, STRUCTURE_JSON);
            })
            .then(function(structure){
                structVersion = structure.geometry.version;
                return localVersion == structVersion;
            });
        })
        .catch(function(e){ return false; });
    }

    return {
        get: get,
        validate : validate
    }
});
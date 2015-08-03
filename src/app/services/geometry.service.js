angular.module('gisMobile').service('Geometry', function(localStorage, xmlparser, STRUCTURE_URL, STRUCTURE_JSON, GEOMETRY_JSON, PROJECTIONS, LEAF_PROJ){

    var Log = Logger.get('Geometry');
    var projSystem;
    //Load geometry
    function load(){
        //Hook posList call back to GEOMETRY_JSON
        GEOMETRY_JSON.domainSet.MultiSurface.Polygon.outerBoundaryIs.coordinates.callback = processPosList;
        GEOMETRY_JSON.domainSet.MultiSurface.Polygon.innerBoundaryIs.coordinates.callback = processPosList;

        Log.time('Loading geometry');
        return localStorage.getGeometry()
        .then(function(geo){
            Log.timeEnd('Loading geometry');
            Log.debug('Geometry loaded from cache');

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
                    Log.timeEnd('Loading geometry');
                    Log.debug('Geometry loaded from url');
                    localStorage.saveGeometry(geo);
                    return geo;
                });
            });
        });
    }
    
    //Change projection
    function changeProjection(srcProj, point){
        return proj4(srcProj, LEAF_PROJ, point);
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
            // result.push(toLeafletPoint(changeProjection("EPSG:32188", rawPos[i].split(','))));
            // console.log(rawPos[i].charCodeAt(0));
            if(rawPos[i] != '' && rawPos[i].charCodeAt(0) != 10)
                result.push(toLeafletPoint(rawPos[i].split(',')));
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

        Log.time('Validating geometry version');
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
                Log.timeEnd('Validating geometry version');
                return localVersion == structVersion;
            });
        })
        .catch(function(e){ 
            Log.timeEnd('Validating geometry version'); 
            return false; 
        });
    }

    //Flush the cached version
    function flush(){
        Log.debug('Flushing geometry cache');
        return localStorage.flushGeometry();
    }

    function defineProjections(){
        _.forEach(PROJECTIONS, function(proj, index){
            proj4.defs(proj.name, proj.definition);
        })
    }

    //Init everything
    defineProjections();

    return {
        get: get,
        validate : validate,
        flush: flush,
        changeProjection: changeProjection
    }
});
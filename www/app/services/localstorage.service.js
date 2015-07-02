angular.module('gisMobile').service('localStorage', function($q, $pouchdb, LOCAL_DB_NAME){
    //Init
    function init(){
        $pouchdb.openDatabase(LOCAL_DB_NAME);
    }

    //Save/update the structure document
    function saveStructure(structure){
        structure._id = 'structure';
        return $pouchdb.put(structure);
    }

    //Get the structure
    function getStructure(){
        return $pouchdb.get('structure');
    }

    //Update/save an indicator
    function saveIndicator(indicator){
        indicator._id = indicator.name;
        return $pouchdb.put(indicator);
    }

    //Get an indicator
    function getIndicator(name){
        return $pouchdb.get(name);
    }

    //Save/update the geometry
    function saveGeometry(geo){
        geo._id = 'geometry'
        return $pouchdb.put(geo)
    }

    //Get the geometry
    function getGeometry(){
        return $pouchdb.get('geometry')
    }

    init();
    return {
        saveStructure: saveStructure,
        getStructure: getStructure,
        getIndicator: getIndicator,
        saveIndicator: saveIndicator,
        getGeometry: getGeometry,
        saveGeometry: saveGeometry
    }
});
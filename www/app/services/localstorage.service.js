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

    //Flush geometry
    function flushGeometry(){
        return $pouchdb.remove('geometry');
    }

    function reset(){
        $pouchdb.resetDatabase();
    }

    function saveAlert(alert){
        alert._id = "alert-" + Math.floor(Math.random() * 100000000).toString(16).substring(0,6); //Append a 6 digit random hexa
        return $pouchdb.put(alert)
        .catch(function(e){
            if(e.name == 'conflict') saveAlert(alert); //Try a new random number
            return $q.reject(e);
        });
    }

    function listAlerts(){
        return $pouchdb.listAllIdWith('alert-')
        .then(function(result){
            return result.rows;
        });
    }

    function removeAlert(id){
        return $pouchdb.remove(id);
    }

    function flushAlerts(){
        return listAlerts().then(function(alerts){
            var promise;
            _.forEach(alerts, function(alert, index){ promise = $pouchdb.remove(alert.id); });
            return promise;
        });
    }

    init();
    return {
        saveStructure: saveStructure,
        getStructure: getStructure,
        
        getIndicator: getIndicator,
        saveIndicator: saveIndicator,

        getGeometry: getGeometry,
        saveGeometry: saveGeometry,
        flushGeometry: flushGeometry,
        
        saveAlert: saveAlert,
        listAlerts: listAlerts,
        removeAlert: removeAlert,
        flushAlerts: flushAlerts,

        reset: reset
    }
});
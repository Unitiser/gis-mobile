angular.module('gisMobile').service('localStorage', function($q, $pouchdb, LOCAL_DB_NAME, LOGIN_CLIENT){
    var Log = Logger.get('localStorage');

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

    function flushStructure(){
        return $pouchdb.remove('structure');
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

    //Flush indicator
    function flushIndicator(id){
        return $pouchdb.remove(id);
    }

    //Save/update the geometry
    function saveGeometry(geo){
        Log.info('Geometry was saved');
        geo._id = 'geometry';
        return $pouchdb.put(geo)
    }

    //Get the geometry
    function getGeometry(){
        Log.info('Fetching geometry');
        return $pouchdb.get('geometry')
    }

    //Flush geometry
    function flushGeometry(){
        return $pouchdb.remove('geometry');
    }

    function reset(){
        return $pouchdb.resetDatabase();
    }

    function saveAlert(alert){
        if(alert._id == undefined) //Append a 6 digit random hexa
            alert._id = "alert-" + (Math.floor(Math.random() * 100000000).toString(16) + "000000").substring(0,6);

        return $pouchdb.put(alert)
        .catch(function(e){
            //Try a new random number
            if(e.name == 'conflict') { 
                alert._id = undefined; 
                return saveAlert(alert); 
            }
            return $q.reject(e);
        });
    }

    function listAlerts(){
        return $pouchdb.listAllIdWith('alert-')
        .then(function(result){
            return _.pluck(result.rows, 'doc');
        });
    }

    function removeAlert(id){
        return $pouchdb.remove(id);
    }

    function flushAlerts(){
        return listAlerts().then(function(alerts){
            var promise;
            _.forEach(alerts, function(alert, index){ promise = $pouchdb.remove(alert._id); });
            return promise;
        });
    }

    function saveAuth(auth){
        auth._id = LOGIN_CLIENT;
        return $pouchdb.put(auth);
    }

    function getAuth(){
        return $pouchdb.get(LOGIN_CLIENT);
    }

    function removeAuth(){
        return $pouchdb.remove(LOGIN_CLIENT);
    }

    init();
    return {
        saveStructure: saveStructure,
        getStructure: getStructure,
        flushStructure: flushStructure,
        
        getIndicator: getIndicator,
        saveIndicator: saveIndicator,
        flushIndicator: flushIndicator,

        getGeometry: getGeometry,
        saveGeometry: saveGeometry,
        flushGeometry: flushGeometry,
        
        saveAlert: saveAlert,
        listAlerts: listAlerts,
        removeAlert: removeAlert,
        flushAlerts: flushAlerts,

        saveAuth : saveAuth,
        getAuth : getAuth,
        removeAuth : removeAuth,

        reset: reset
    }
});
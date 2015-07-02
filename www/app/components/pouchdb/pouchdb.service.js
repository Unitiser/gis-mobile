angular.module('gis.pouchdb', [])
.service('$pouchdb', function($q){
    var db;
    var dbName;

    //Open the database and return the information
    function openDatabase(name){
        dbName = name;
        db = new PouchDB(dbName);
        return $q.when(db.info())
    }

    //Reset the database
    function resetDatabase(){
        return $q.when(db.destroy())
        .then(function(promise){
            db = new PouchDB(dbName);
            return promise;
        });
    }

    //Save a doc in the db
    function put(doc){
        return $q.when(db.put(doc));
    }


    //Get a doc from the db
    function get(id){
        return $q.when(db.get(id));
    }

    return {
        openDatabase: openDatabase,
        put: put,
        get: get,
        resetDatabase: resetDatabase
    }
});
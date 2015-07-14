angular.module('gis.pouchdb', [])
.service('$pouchdb', function($q){
    var db;
    var dbName;

    //Open the database and return the information
    function openDatabase(name){
        dbName = name;
        db = new PouchDB(dbName, {adapter : 'websql'});
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

    //Delete a doc from the db
    function remove(id){
        return $q.when(db.get(id).then(function(doc){
            return db.remove(doc);
        }));
    }

    //List doc containing value in id
    function listAllIdWith(value){
        return $q.when(db.allDocs({
            startkey: value,
            endkey: value + '\uffff'
        }));
    }

    return {
        openDatabase: openDatabase,
        put: put,
        get: get,
        remove: remove,
        resetDatabase: resetDatabase,
        listAllIdWith: listAllIdWith
    }
});
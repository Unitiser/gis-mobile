angular.module('gis.pouchdb', [])
.service('$pouchdb', function($q){
    var db;
    var dbName;

    //Open the database and return the information
    function openDatabase(name){
        // var deferred = $q.defer();
        return $q(function(resolve, reject){
            dbName = name;
            db = new PouchDB(dbName);
            db.info()
            .then(function(info){
                resolve(info);
            })
            .catch(reject)
        });
         
    }

    //Reset the database
    function resetDatabase(){
        db.destroy()
        .then(function(){
            db = new PouchDB(dbName);
        });
    }

    //Save a doc in the db
    function put(doc){
        var deferred = $q.defer();
        
        db.put(doc)
        .then(function(doc){
            deferred.resolve(doc);
        })
        .catch(function(err){
            deferred.reject(err);
        });

        return deferred.promise;
    }


    //Get a doc from the db
    function get(id){
        var deferred = $q.defer();

        db.get(id).then(function(doc){
            deferred.resolve(doc);
        }).catch(function(err){
            deferred.reject(err);
        });

        return deferred.promise;
    }

    return {
        openDatabase: openDatabase,
        put: put
    }
});
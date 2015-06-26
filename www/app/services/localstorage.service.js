angular.module('gisMobile').service('localStorage', function($q){
    var db;

    //Open the database
    function openDadabase(){
        var deferred = $q;
        db = new PouchDB('gisMobile');
        db.info().then(function (info) {
          console.log(info);
        });
    }

    //Reset the database
    function resetDatabase(){
        db.destroy()
        .then(function(){
            db = new PouchDB('gisMobile');
        });
    }

    //Save/update the structure document
    //Get the structure

    //Update/save an indicator
    //Get an indicator

    //Save/update the geometry
    //Get the geomety

    //Save a doc in the db
    function put(doc){
        var deferred = $q.defer();
        
        db.put(doc)
        .then(function(){
            deferred.resolve('great success!');
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
        put: function(doc){
            return $q(function(resolve, reject){
                db.put(doc)
                .then(function(){
                    resolve('great success!');
                })
                .catch(function(err){
                    reject(err);
                });
            })

        },
        get: function(id, cb){
            return $q(function(resolve, reject){
                db.get(id).then(function(doc){
                    resolve(doc);
                }).catch(function(err){
                    reject(err);
                });
            });
        }
    }
});
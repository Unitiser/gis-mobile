angular.module('gisMobile').service('localStorage', function($q){
    var db = new PouchDB('atlacdq');

    db.info().then(function (info) {
      console.log(info);
    });

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
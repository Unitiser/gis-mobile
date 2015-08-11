angular.module('gisMobile').service('Preload', function($cordovaNetwork, $q, $rootScope, Structure, Indicator, Geometry, Alert, Auth, $cordovaSplashscreen){
    var categories;
    var Log = Logger.get('Preload');
    
    function checkNetwork(){
        Log.info('Checking network');
        return $q.when($cordovaNetwork.isOnline());
    }

    function checkIsLoggedIn(){
        Log.info('Checking authentication status');
        return Auth.testConnection()
        .then(function(isValid){
            if(isValid)
                return $q.when(true);
            else
                return $q.reject({ name: 'not_authenticated', message : 'You need to login burh' });
        });
    }

    function reloadStructure(){
        Log.info('Reloading structure');
        return Structure.getRemote()
        .then(function(structure){
            Log.info('Structure reloaded.');
            return Structure.getCategories();
        })
        .catch(function(e){
            Log.warn('Counld not reload structure');
            console.log(e);
            return $q.reject(e);
        });
    }

    function preloadGeometry(){
        return Geometry.validate()
        .then(function(isValid){
            if(!isValid){
                Log.info('Geometry invalid, reloading.');
                return Geometry.flush().finally(function(){ 
                    Log.info('Geometry flushed');
                    return Geometry.get(); 
                }).then(function(){
                    Log.info('Geometry cached');
                    return true;
                });
            }
            Log.info('Geometry valid');
            return true;
        })
        .catch(function(e){
            Log.info('Geometry has been loaded from scratch');
        })
    }

    function preloadAlerts(){
        return Alert.list()
        .then(function(alerts){
            var indicators = [];
            var promise;

            _.forEach(alerts, function(a, index){
                var ind = _.first(a.params);
                indicators.push(ind);
            });

            _.forEach(_.uniq(indicators), function(id, index){
                Indicator.validate(id)
                .then(function(isValid){
                    if(!isValid){
                        Log.info(id + ' is not valid, reloading');
                        promise = Indicator.getRemote(id)
                        .then(function(){ 
                            Log.info(id + ' has been reloaded');
                            return true;
                        })
                        .catch(function(e){
                            Log.warn('Unable to reload indicator ' + id);
                            return $q.reject(e);
                        });
                    }
                });
            });

            return promise;
        });
    }

    function hideSplashScreen(){
        return $q.when($cordovaSplashscreen.hide());
    }

    function showSplashScreen(){
        return $q.when($cordovaSplashscreen.show());
    }

    function go(){
        return showSplashScreen()
        .then(checkNetwork)
        .then(function(isOnline){
            $rootScope.isOnline = isOnline;
            if(isOnline){
                return checkIsLoggedIn()
                .then(reloadStructure)
                .then(preloadGeometry)
                .then(preloadAlerts)
            }else{
                return $q.reject({ name : 'not_connected' });
            }
        })
        .then(function(){
            Log.info('Preloading complete.');
        })
        .catch(function(e){
            console.log(e);
            Log.info('An error occured during the preloading.');
            return $q.reject(e);
        })
        .finally(hideSplashScreen);
    }

    return {
        checkNetwork: checkNetwork,
        reloadStructure: reloadStructure,
        preloadGeometry: preloadGeometry,
        preloadAlerts: preloadAlerts,
        go: go
    }
});
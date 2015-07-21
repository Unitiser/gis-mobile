angular.module('gisMobile').service('Preload', function($cordovaNetwork, $q, Indicator, Geometry, Alert, $cordovaSplashscreen){
    var categories;
    var Log = Logger.get('Preload');
    
    function checkNetwork(){
        return $q.when($cordovaNetwork.isOnline());
    }

    function reloadStructure(){
        return Indicator.flushStructure()
        .then(function(){
            Log.info('Structure flushed');
            return Indicator.getCategories();
        }).then(function(){
            Log.info('Structure cached');
            return true;
        })
        .catch(function(e){
            console.log(e);
            return Indicator.getCategories();
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
                        promise = Indicator.flushIndicator(id)
                        .then(function(){
                            Log.info(id + ' has been flushed');
                            return Indicator.get(id).then(function(){ 
                                Log.info(id + ' has been reloaded');
                            });
                        })
                        .catch(function(e){ 
                            Log.info('Nothing to delete, trying to load');
                            return Indicator.get(id).then(function(){ 
                                Log.info(id + ' has been reloaded');
                            });
                        });
                    }
                    Log.info(id + ' is valid');
                });
            });

            return promise;
        });
    }

    function hideSplashScreen(){
        return $q.when($cordovaSplashscreen.hide());
    }

    function go(){
        return checkNetwork()
        .then(function(isOnline){
            if(isOnline){
                return reloadStructure()
                .then(preloadGeometry)
                .then(preloadAlerts)
                .then(hideSplashScreen);
            }else{
                return false;
            }
        })
        .then(function(){
            Log.info('Preloading complete.');
        })
        .catch(function(e){
            console.log(e);
            Log.info('An error occured during the preloading.');
        })
    }

    return {
        checkNetwork: checkNetwork,
        reloadStructure: reloadStructure,
        preloadGeometry: preloadGeometry,
        preloadAlerts: preloadAlerts,
        go: go
    }
});
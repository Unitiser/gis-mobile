angular.module('gisMobile').service('Structure', function(xmlparser, $q, localStorage, $rootScope, STRUCTURE_URL, STRUCTURE_JSON){
    var Log = Logger.get('Structure');
    var isStructureFresh;

    // Load structure from remote
    function getRemote(){
        return xmlparser.readFile(STRUCTURE_URL, STRUCTURE_JSON)
        .then(function(structure){
            Log.debug('Structure loaded from url');
            localStorage.saveStructure(structure);
            return structure;
        });
    }

    // Load structure from cache
    function getLocal(){
        return localStorage.getStructure()
        .then(function(structure){
            Log.debug('Structure loaded from cache');
            return structure;
        })
        .catch(function(e){
            Log.debug('Structure is not in localStorage');
            return $q.reject(e);
        });
    }
    
    // Get geometry
    function getGeometry(){
        return localStorage.getStructure()
        .then(function(structure){
            return structure.geometry;
        });
    }

    // Get categories
    function getCategories(){
        return localStorage.getStructure()
        .then(function(structure){ 
            return structure.category 
        })
    }
    
    // Get indicator by categories
    function getIndicatorFrom(catId){
        return getCategories()
        .then(function(cats){
            var cat = _.find(cats, { id : catId });
            if(cat){
                return cat.indicator;
            }else{
                Log.debug('Category ' + catId + " was not found in localStorage");
                return $q.reject({name : 'not_found'});
            }
        });
    }

    // Get offline indicators by categories
    function getOfflineIndicatorFrom(catId){
        return getIndicatorFrom(catId)
        .then(function(indicators){
            var promise;
            var offlineIndicators = [];
            
            _.forEach(indicators, function(indicator){
                promise = isIndicatorCached(indicator.id)
                .then(function(isCached){
                    if(isCached)
                        offlineIndicators.push(indicator);
                });
            });

            return promise.then(function(){
                return offlineIndicators;
            });
        });
    }

    function isIndicatorCached(id){
        return localStorage.getIndicator(id)
        .then(function(ind){ return true; })
        .catch(function(e){ return false; });
    }

    return {
        getRemote : getRemote,
        getLocal : getLocal,
        getGeometry : getGeometry,
        getCategories : getCategories,
        getIndicatorFrom : getIndicatorFrom,
        getOfflineIndicatorFrom : getOfflineIndicatorFrom
    }
});
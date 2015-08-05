angular.module('gisMobile', ['gis.xmlparser', 'gis.pouchdb', 'ngCordovaMocks']);

angular.module('gisMobileMocks', [])

.constant('STRUCTURE_URL', 'http://192.168.0.117:8080/evalpro-dashboard/mobileApi/structure')

.service('localStorage', function($q, MOCKS){

    localStorageMock = {
        isMock: true,
        isGeometryCached: false,
        isStructureCached: false,
        isIndicatorCached: false,

        // Structure
        getStructure: function(){
            var defer = $q.defer();
            if(localStorageMock.isStructureCached)
                defer.resolve(MOCKS.structure);
            else
                defer.reject({name: 'not_found'});
            return defer.promise;
        },
        saveStructure: function(){
            localStorageMock.isStructureCached = true;
        },
        flushStructure: function(){
            var defer = $q.defer();
            defer.resolve();
            localStorageMock.isStructureCached = false;
            return defer.promise;
        },
        
        // Indicators
        getIndicator: function(id){
            var defer = $q.defer();
            if(localStorageMock.isIndicatorCached && id == 'primary')
                defer.resolve(MOCKS.indicator);
            else
                defer.reject({name: 'not_found'});
            return defer.promise;
        },
        saveIndicator: function(){
            localStorageMock.isIndicatorCached = true;
        },
        flushIndicator: function(){
            localStorageMock.isIndicatorCached = false;
            return $q.when(false);
        },

        // Geometry
        getGeometry: function(){
            var defer = $q.defer();
            if(localStorageMock.isGeometryCached){
                defer.resolve(MOCKS.geometry);
            }
            else
                defer.reject({name: 'not_found'});
            return defer.promise;
        },
        saveGeometry: function(){
            localStorageMock.isGeometryCached = true;
        },
        flushGeometry: function(){
            var defer = $q.defer();
            localStorage.isGeometryCached = false;
            defer.resolve();
            return defer.promise;
        }
    };

    return localStorageMock;
})

.service('xmlparser', function($q, MOCKS, STRUCTURE_URL){
    var xmlParserMock = {
        readFileCount: 0,
        readFile: function(url){
            var defer = $q.defer();
            switch(url){
                case STRUCTURE_URL:
                    defer.resolve(MOCKS.structure);
                break;
                case 'mocks/geometry':
                    defer.resolve(MOCKS.geometry);
                break;
                case 'mocks/indicator/primary':
                    defer.resolve(MOCKS.indicator);
                break;
                default:
                    defer.reject({name: 'not_found'}); 
                break;
            }
            return defer.promise;
        },
        loadFile: function(url){
            var defer = $q.defer();
            defer.resolve('mock');
            return defer.promise;
        },
        readXML: function(xml, json){
            var defer = $q.defer();
            switch(xmlParserMock.readFileCount){
                case 0:
                    xmlParserMock.readFileCount ++;
                    defer.resolve(MOCKS.indicatorStatic);
                break;
                case 1:
                    xmlParserMock.readFileCount = 0;
                    defer.resolve(MOCKS.indicatorValue);
                break;
            }
            return defer.promise;
        }
    };
    return xmlParserMock;
});
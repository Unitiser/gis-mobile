describe('Geometry service', function(){
    var $q, $rootScope, Geometry, localStorageMock, xmlParserMock, MOCKS;
    var readFileSpy;
    
    beforeEach(module('gisMobile', function($provide){
        xmlParserMock = {
            readFile: function(url, json){
                var defer = $q.defer();
                if(url == '/some/place/geometry.xml')
                    defer.resolve(MOCKS.geometry);
                else
                    defer.resolve(MOCKS.structure);
                return defer.promise;
            }
        };
        localStorageMock = {
            isGeometryCached: false,
            isStructureCached: false,
            getStructure: function(){
                var defer = $q.defer();
                if(localStorageMock.isStructureCached)
                    defer.resolve(MOCKS.structure);
                else
                    defer.reject({name: 'not_found'});
                return defer.promise;
            },
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
            saveStructure: function(){
                localStorageMock.isStructureCached = true;
            }
        };

        $provide.value('xmlparser', xmlParserMock);
        $provide.value('localStorage', localStorageMock);

        readFileSpy = spyOn(xmlParserMock, 'readFile').and.callThrough();
        spyOn(localStorageMock, 'getStructure').and.callThrough();
        spyOn(localStorageMock, 'getGeometry').and.callThrough();
        spyOn(localStorageMock, 'saveGeometry').and.callThrough();
    }));
    
    beforeEach(inject(function(_$q_,_$rootScope_,_Geometry_, _MOCKS_){
        $q = _$q_;
        $rootScope = _$rootScope_;
        Geometry = _Geometry_;
        MOCKS = _MOCKS_;
    }));

    it('should load geometry from file', function(done){
        Geometry.get()
        .then(function(geo){
            done();
        });
        $rootScope.$digest();
        expect(xmlParserMock.readFile).toHaveBeenCalled();
        expect(localStorageMock.saveGeometry).toHaveBeenCalled();
    });

    it('should load geometry from cache', function(done){
        localStorageMock.isGeometryCached = true;
        localStorageMock.isStructureCached = true;
        Geometry.get()
        .then(function(geo){
            done();
        });
        $rootScope.$digest();
        expect(readFileSpy.calls.count()).toBe(0);
    });

    // it('should be able to change projection');
    it('should validate the cached version against the structure document', function(done){
        localStorageMock.isGeometryCached = true;
        localStorageMock.isStructureCached = true;
        Geometry.validate()
        .then(function(isValid){
            expect(isValid).toBe(true);
            done();
        });
        $rootScope.$digest();
    });
});
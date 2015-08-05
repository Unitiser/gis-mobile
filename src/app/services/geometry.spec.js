describe('Geometry service', function(){
    var $rootScope, Geometry, localStorageMock, xmlParserMock, MOCKS;
    // var $rootScope, Geometry;
    var readFileSpy;
    
    beforeEach(function(){
        module('gisMobile');
        module('gisMobileMocks');

        inject(function(_$rootScope_,_Geometry_, _localStorage_, _xmlparser_){
            xmlParserMock = _xmlparser_
            localStorageMock = _localStorage_;
            $rootScope = _$rootScope_;
            Geometry = _Geometry_;

            readFileSpy = spyOn(xmlParserMock, 'readFile').and.callThrough();
            spyOn(localStorageMock, 'getStructure').and.callThrough();
            spyOn(localStorageMock, 'getGeometry').and.callThrough();
            spyOn(localStorageMock, 'saveGeometry').and.callThrough();
        });
    });

    it('should load geometry from file', function(done){
        Geometry.get()
        .then(function(geo){
            expect(xmlParserMock.readFile).toHaveBeenCalled();
            expect(localStorageMock.saveGeometry).toHaveBeenCalled();
            done();
        });
        $rootScope.$digest();
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

    it('should flush the cache', function(done){
        Geometry.flush()
        .then(function(){
            expect(localStorageMock.isGeometryCached).toBe(false);
            done();
        });
        $rootScope.$digest();
    })
});
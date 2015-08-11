
describe("Indicator service", function() {
    var basePathXml = '/base/lib/xmlDocuments/';
    var Indicator, $rootScope, $pouchdb, $q, MOCKS;
    var xmlParserMock, localStorageMock;
    var readFileSpy, getStructureSpy, saveStructureSpy;

    beforeEach(function(){
        module('gisMobile');
        module('gisMobileMocks');

        inject(function(_$rootScope_, _Indicator_, _xmlparser_, _localStorage_) {
            $rootScope = _$rootScope_;
            Indicator = _Indicator_;
            xmlParserMock = _xmlparser_;
            localStorageMock = _localStorage_;
        });

        localStorageMock.isStructureCached = true;
        readFileSpy = spyOn(xmlParserMock, 'readFile').and.callThrough();
        spyOn(xmlParserMock, 'loadFile').and.callThrough();
        spyOn(xmlParserMock, 'readXML').and.callThrough();
        getStructureSpy = spyOn(localStorageMock, 'getStructure').and.callThrough();
        saveStructureSpy = spyOn(localStorageMock, 'saveStructure').and.callThrough();
        spyOn(localStorageMock, 'flushStructure').and.callThrough();
        spyOn(localStorageMock, 'flushIndicator').and.callThrough();
    });

    it('should retrieve a single indicator', function(done){
        Indicator.getSummary('primary')
        .then(function(indicator){ 
            expect(indicator.id).toBe('primary');
        })
        .catch(function(e){ expect(e).toBe(null); })
        .finally(function(){done()});

        $rootScope.$digest();
    });

    it('should retrieve a single indicator #2', function(done){
        Indicator.getSummary('something')
        .then(function(indicator){ expect(indicator.id).toBe('something'); })
        .catch(function(e){ expect(e).toBe(null); })
        .finally(done);

        $rootScope.$digest();
    });

    it('should fail when retrieving non existing indicator', function(done){
        Indicator.getSummary('unicorns')
        .then(function(indicator){ expect(indicator.id).toBe(null); })
        .catch(function(e){ expect(e).toBe('unicorns not found'); })
        .finally(done);

        $rootScope.$digest();
    });

    it('should load the details of a non cached indicator', function(done){
        Indicator.getRemote('primary')
        .then(function(indicator){
            expect(indicator.name).toBe('primary');
            expect(indicator.param.length).toBe(2);
            expect(indicator.value.length).toBe(2);
            expect(xmlParserMock.loadFile).toHaveBeenCalled();
            expect(xmlParserMock.readXML).toHaveBeenCalled();
            done()
        })
        .catch(function(e){expect(e).toBe(null)});

        $rootScope.$digest();
    });

    it('should load details of a local indicator', function(done){
        localStorageMock.isIndicatorCached = true;
        Indicator.getLocal('primary')
        .then(function(indicator){
            expect(indicator.name).toBe('primary');
            expect(indicator.param.length).toBe(2);
            expect(indicator.value.length).toBe(2);
            done();
        });
        $rootScope.$digest();
    });

    it('should validate an indicator version localStorage vs structure', function(done){
        localStorageMock.isIndicatorCached = true;
        Indicator.validate('primary')
        .then(function(isValid){
            expect(isValid).toBe(true);
            done();
        });
        $rootScope.$digest();
    });

    it('should tell if an indicator is not cached', function(done){
        Indicator.isCached('primary')
        .then(function(isCached){ expect(isCached).toBe(false) }).finally(done);
        $rootScope.$digest();
    });

    it('should tell if an indicator cached', function(done){
        localStorageMock.isIndicatorCached = true;
        Indicator.isCached('primary')
        .then(function(isCached){ expect(isCached).toBe(true) }).finally(done);
        $rootScope.$digest();
    });

    it('should be able to flush an indicator', function(done){
        Indicator.flushIndicator()
        .then(function(){ expect(localStorageMock.flushIndicator).toHaveBeenCalled(); })
        .finally(done);
        $rootScope.$digest();
    });
});
describe('Structure', function(){
    var Structure, $rootScope;
    var localStorageMock, xmlParserMock;

    beforeEach(function(){
        module('gisMobile');
        module('gisMobileMocks');

        inject(function(_$rootScope_, _Structure_, _MOCKS_, _localStorage_, _xmlparser_){
            Structure = _Structure_;
            $rootScope = _$rootScope_;
            MOCKS = _MOCKS_;
            localStorageMock = _localStorage_;
            xmlParserMock = _xmlparser_;
            
            spyOn(xmlParserMock, 'readFile').and.callThrough();
            spyOn(localStorageMock, 'getStructure').and.callThrough();
        });
    });

    it('should load from remote xml', function(done){
        Structure.getRemote()
        .then(function(structure){
            expect(structure.category.length).toBe(2);
            expect(structure.geometry.id).toBe('cdq');
            expect(xmlParserMock.readFile).toHaveBeenCalled();
            done();
        });
        $rootScope.$digest();
    });

    it('should load from localStorage', function(done){
        localStorageMock.isStructureCached = true;
        Structure.getLocal()
        .then(function(structure){
            expect(structure.category.length).toBe(2);
            expect(structure.geometry.id).toBe('cdq');
            expect(localStorageMock.getStructure).toHaveBeenCalled();
            done();
        });
        $rootScope.$digest();
    });

    it('should tell when localStorage is not defined', function(){
        Structure.getLocal()
        .then(function(structure){ })
        .catch(function(e){
            expect(e.name).toBe('not_found');
        });
        $rootScope.$digest();
    });

    it('should return categories', function(done){
        localStorageMock.isStructureCached = true;
        Structure.getCategories()
        .then(function(cats){
            expect(cats.length).toBe(2);
            expect(cats[0].label).toBe('Emplois par secteur d\'activité');
            expect(cats[1].label).toBe('Emplois par niveau de compétence');
            expect(localStorageMock.getStructure).toHaveBeenCalled();
            done();
        });
        $rootScope.$digest();
    });
    
    it('should return geometry', function(done){
        localStorageMock.isStructureCached = true;
        Structure.getGeometry()
        .then(function(geo){
            expect(geo.id).toBe('cdq');
            expect(localStorageMock.getStructure).toHaveBeenCalled();
            done();
        });
        $rootScope.$digest();
    });

    it('should return indicators by categories', function(done){
        localStorageMock.isStructureCached = true;
        Structure.getIndicatorFrom('activity_sector')
        .then(function(indicators){
            expect(indicators.length).toBe(2);
            expect(indicators[0].id).toBe('primary');
            done();
        });
        $rootScope.$digest();
    });

    it('should tell if specific categories id doent exist', function(done){
        localStorageMock.isStructureCached = true;
        Structure.getIndicatorFrom('rubish')
        .then(function(indicators){ })
        .catch(function(e){
            expect(e.name).toBe('not_found');
            done();
        });
        $rootScope.$digest();
    });

    it('should return offline indicators by categories', function(done){
        localStorageMock.isStructureCached = true;
        localStorageMock.isIndicatorCached = true;
        Structure.getOfflineIndicatorFrom('activity_sector')
        .then(function(indicators){
            expect(indicators.length).toBe(1);
            done();
        });
        $rootScope.$digest();
    });

    it('should be able to flush the structure');
});
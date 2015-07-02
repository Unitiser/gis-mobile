
describe("Indicator service", function() {
    var basePathXml = '/base/lib/xmlDocuments/';
    var Indicator, $httpBackend, $rootScope, $pouchdb, $q, $injector;
    var xmlParserMock, localStorageMock;
    var readFileSpy, getStructureSpy, saveStructureSpy;

    //Mock gis-mobile
    beforeEach(module('gisMobile', function($provide){
        xmlParserMock = {
            readFileCount: 0,
            readFile: function(url){
                var defer = $q.defer();
                defer.resolve(indicatorJsonMock);
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
                        defer.resolve(sampleIndicatorStatic);
                    break;
                    case 1:
                        xmlParserMock.readFileCount = 0;
                        defer.resolve(sampleIndicatorValue);
                    break;
                }
                return defer.promise;
            }
        };

        localStorageMock = {
            isStructureCached: false,
            isIndicatorCached: false,
            getStructure: function(){
                var defer = $q.defer();
                if(localStorageMock.isStructureCached)
                    defer.resolve(indicatorJsonMock);
                else
                    defer.reject({name: 'not_found'});
                return defer.promise;
            },
            saveStructure: function(){
                localStorageMock.isStructureCached = true;
            },
            getIndicator: function(){
                var defer = $q.defer();
                if(localStorageMock.isIndicatorCached)
                    defer.resolve(sampleIndicator);
                else
                    defer.reject({name: 'not_found'});
                return defer.promise;
            },
            saveIndicator: function(){
                localStorageMock.isIndicatorCached = true;
            }
        }

        $provide.value('xmlparser', xmlParserMock);
        $provide.value('localStorage', localStorageMock);

        //Enroll some spies
        readFileSpy = spyOn(xmlParserMock, 'readFile').and.callThrough();
        getStructureSpy = spyOn(localStorageMock, 'getStructure').and.callThrough();
        saveStructureSpy = spyOn(localStorageMock, 'saveStructure').and.callThrough();
    }));

    beforeEach(inject(function(_$q_, _$rootScope_, _Indicator_) {
        $q = _$q_;
        $rootScope = _$rootScope_;
        Indicator = _Indicator_;
    }));

    it('should list the categories', function(done){
        var promise = Indicator.getCategories()
        .then(function(categories){
            expect(categories[1].name).toBe('Emplois par secteur d\'activité');
            expect(categories[0].name).toBe('Emplois par niveau de compétence');
            done();
        })
        .catch(function(e){
            expect(e).toBe(null);
        });

        $rootScope.$digest();
        expect(readFileSpy).toHaveBeenCalled();
    });

    it('should list indicator by categories', function(done){
        var catName = 'activity_sector';
        Indicator.getByCategory(catName)
        .then(function(indicators){
            expect(indicators.length).toBe(2);
        })
        .catch(function(e){
            expect(e).toBe(null);
        })
        .finally(done);
        $rootScope.$digest();
    });

    it('should retrieve a single indicator', function(done){
        Indicator.getSummary('primary')
        .then(function(indicator){ expect(indicator.id).toBe('primary'); })
        .catch(function(e){ expect(e).toBe(null); })
        .finally(function(){done()});

        $rootScope.$digest();
        expect(readFileSpy).toHaveBeenCalled();
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

    it('should cache the category document', function(done){
        Indicator.getSummary('something')
        .then(function(indicator){  })
        .catch(function(e){  })

        $rootScope.$digest();

        Indicator.getSummary('something')
        .then(function(indicator){ expect(indicator.id).toBe('something'); })
        .catch(function(e){ expect(e).toBe(null); })
        .finally(done);

        $rootScope.$digest();
        expect(readFileSpy.calls.count()).toBe(1);
    });

    it('should load the details of the indicator', function(){
        Indicator.get('primary')
        .then(function(indicator){
            expect(indicator.name).toBe('primary');
            expect(indicator.param.length).toBe(2);
            expect(indicator.value.length).toBe(2);
        })
        .catch(function(e){expect(e).toBe(null)});
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


    //Mocked return objects
    var indicatorJsonMock = {
        category: [{
            id: 'activity_sector',
            label: "Emplois par secteur d'activité",
            indicator: [{
                id: 'primary',
                label: 'Primaire',
                version: "1.0",
                url: "http://108.163.190.66/prototype/atlas_eq_2015/engine_data/emplois/2011/s_a_t_1_2011.xml"
            }, {
                id: 'secondary',
                label: 'Secondaire',
                version: "1.0",
                url: "http://108.163.190.66/prototype/atlas_eq_2015/engine_data/emplois/2011/s_a_t_2_2011.xml"
            }]
        },{
            id: 'competency_level',
            label: 'Emplois par niveau de compétence',
            indicator: [{
                id: 'something',
                label: 'Else',
                version: "1.0",
                url: "http://108.163.190.66/prototype/atlas_eq_2015/engine_data/emplois/2011/s_a_t_1_2011.xml"
            }]
        }],
        geometry: {
            id: "cdq",
            label: "Centre-du-Québec",
            version: "1.0"
        }
    };

    var sampleIndicatorSummary = {
        id: 'something',
        label: 'Else',
        version: "1.0",
        url: "http://108.163.190.66/prototype/atlas_eq_2015/engine_data/emplois/2011/s_a_t_1_2011.xml"
    };


    var sampleIndicatorStatic = {
        name: 'primary',
        description: 'This is a description',
        param: [{
            name: 'men',
            type: 'Integer',
            content: 'Number of men in the region'
        },{
            name: 'women',
            type: 'Integer',
            content: 'Number of women in the region'
        }],
        legend: [{
            for: "map",
            item: [{
                min: '0',
                max: '100',
                color: 'yellow',
                content: '0 à 100'
            },{
                min: '101',
                max: '200',
                color: 'red',
                content: '101 à 200'
            }]
        }],
        version: {
            date: '10/20/2012',
            content: '1.0'
        }
    };

    var sampleIndicatorValue = {
        value: [{
            z: 'z0',
            men: '100',
            women: '200'
        },{
            z: 'z1',
            men: '200',
            women: '100'
        }],
    };

    var sampleIndicator = {
        name: 'primary',
        description: 'This is a description',
        label: 'Primaire',
        url: "http://108.163.190.66/prototype/atlas_eq_2015/engine_data/emplois/2011/s_a_t_1_2011.xml",
        param: [{
            name: 'men',
            type: 'Integer',
            content: 'Number of men in the region'
        },{
            name: 'women',
            type: 'Integer',
            content: 'Number of women in the region'
        }],
        value: [{
            z: 'z0',
            men: '100',
            women: '200'
        },{
            z: 'z1',
            men: '200',
            women: '100'
        }],
        legend: [{
            for: "map",
            item: [{
                min: '0',
                max: '100',
                color: 'yellow',
                content: '0 à 100'
            },{
                min: '101',
                max: '200',
                color: 'red',
                content: '101 à 200'
            }]
        }],
        version: {
            date: '10/20/2012',
            content: '1.0'
        }
    }
});
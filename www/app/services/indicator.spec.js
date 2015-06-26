
describe("Indicator service", function() {
    var basePathXml = '/base/lib/xmlDocuments/';
    var Indicator, $httpBackend, $rootScope;

    beforeEach(module('gisMobile'));
    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        Indicator = $injector.get('Indicator');
        $rootScope = $injector.get('$rootScope');

        $httpBackend.whenGET('/lib/xmlDocuments/indicator.xml')
                    .respond(function(){ return [200, indicatorsXmlMock, {}] });
    }));

    it('should list the categories', function(done){
        $httpBackend.expectGET('/lib/xmlDocuments/indicator.xml');
        Indicator.getCategories()
        .then(function(categories){
            expect(categories[0].name).toBe('Emplois par secteur d\'activité');
            expect(categories[1].name).toBe('Emplois par niveau de compétence');
            done()
        })
        .catch(function(e){
            expect(e).toBe(null);
        });
        $httpBackend.flush();
    });

    it('should list indicator by categories', function(done){
        $httpBackend.expectGET('/lib/xmlDocuments/indicator.xml');
        var catName = 'activity_sector';
        Indicator.getIndicators(catName)
        .then(function(indicators){
            expect(indicators.length).toBe(2);
        })
        .catch(function(e){
            expect(e).toBe(null);
        })
        .finally(function(){ done() });
        $httpBackend.flush();
    });

    it('should retrieve a single indicator', function(done){
        $httpBackend.expectGET('/lib/xmlDocuments/indicator.xml');

        Indicator.getIndicator('primary')
        .then(function(indicator){ expect(indicator.name).toBe('primary'); })
        .catch(function(e){ expect(e).toBe(null); })
        .finally(function(){done()});

        $httpBackend.flush();
    });

    it('should retrieve a single indicator #2', function(done){
        $httpBackend.expectGET('/lib/xmlDocuments/indicator.xml');

        Indicator.getIndicator('something')
        .then(function(indicator){ expect(indicator.name).toBe('something'); })
        .catch(function(e){ expect(e).toBe(null); })
        .finally(done);

        $httpBackend.flush();
    });

    it('should fail when retrieving non existing indicator', function(done){
        $httpBackend.expectGET('/lib/xmlDocuments/indicator.xml');

        Indicator.getIndicator('unicorns')
        .then(function(indicator){ expect(indicator.name).toBe(null); })
        .catch(function(e){ expect(e).toBe('unicorns not found'); })
        .finally(done);

        $httpBackend.flush();
    });

    it('should cache the category document', function(done){
        $httpBackend.expectGET('/lib/xmlDocuments/indicator.xml');

        Indicator.getIndicator('something')
        .then(function(indicator){  })
        .catch(function(e){  })

        $httpBackend.flush();

        Indicator.getIndicator('something')
        .then(function(indicator){ expect(indicator.name).toBe('something'); })
        .catch(function(e){ expect(e).toBe(null); })
        .finally(done);

        $rootScope.$digest();
    });
});

var indicatorsXmlMock = '<?xml version="1.0" ?>' +
'<document>' +
    '<category name="activity_sector" label="Emplois par secteur d\'activité">' +
        '<indicator>' +
            '<name>primary</name>' +
            '<label>Primaire</label>' +
            '<version>1.0</version>' +
            '<url>/test/indicator_primary.xml</url>' +
        '</indicator>' +
        '<indicator>' +
            '<name>secondary</name>' +
            '<label>Secondaire</label>' +
            '<version>1.0</version>' +
            '<url>http://108.163.190.66/prototype/atlas_eq_2015/engine_data/emplois/2011/s_a_t_2_2011.xml</url>' +
        '</indicator>' +
    '</category>' +
    '<category name="competency_level" label="Emplois par niveau de compétence">' +
        '<indicator>' +
            '<name>something</name>' +
            '<label>Else</label>' +
            '<version>1.0</version>' +
            '<url>http://108.163.190.66/prototype/atlas_eq_2015/engine_data/emplois/2011/s_a_t_2_2011.xml</url>' +
        '</indicator>' +
    '</category>' +
    '<geometry>' +
        '<name>cdq</name>' +
        '<label>Centre-du-Québec</label>' +
        '<version>1.0</version>' +
    '</geometry>' +
'</document>';

var sampleIndicator = '';
var $injector = angular.injector(['ng','gisMobile']);

describe("Indicator service", function() {
    var basePathXml = '/base/lib/xmlDocuments/';
    var Indicator;
    beforeEach(function(){
        Indicator = $injector.get('Indicator');
    });

    it('should list the categories', function(done){
        Indicator.getCategories(basePathXml + 'indicator.xml')
        .then(function(categories){
            expect(categories[0].name).toBe('Emplois par secteur d\'activité');
            expect(categories[1].name).toBe('Emplois par niveau de compétence');
            done()
        })
        .catch(function(e){
            expect(e).toBe(null);
        });
    });

    it('should list the indicators by categories', function(done){
        // Indicator.getIndicator(cat);
    });

    it('should retreive an indicator by id', function(done){

    });
});
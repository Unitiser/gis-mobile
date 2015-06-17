var $injector = angular.injector(['ng','gisMobile']);


describe("XML data parser service", function() {
  var basePathXml = '/base/lib/xmlDocuments/';
  var xmlparser;
  beforeEach(function(){
    xmlparser = $injector.get('xmlparser');
  });

  it("should be able to load an xml file", function(done) {
    xmlparser.loadFile(basePathXml + 'data.xml').then(function(file){
        expect(file).not.toBe(null);
        done();
    }, function(e){
        console.log(e);
        expect(e).toBe(null);
        done();
    });
  });

  it("should be able to tell if file is valid xml", function(done){
    xmlparser.parseFile(basePathXml + 'data.xml').then(function(fileContent){
        expect(fileContent).not.toBe(null)
        done()
    },
    function(e){
        console.log(e);
        expect(e).toBe(null);
        done();
    });
  });

  it("should be able to tell if a file is invalid", function(done){
    xmlparser.parseFile(basePathXml + 'invalidData.xml').then(function(fileContent){
        // console.log(fileContent);
        expect(fileContent).toBe(null);
        done()
    },
    function(e){
        expect(e).toBe('INVALID XML');
        done();
    });
  });

  it("should be able to read data from simple json structure.", function(done){
    var structure = {
    'section': {
            attrs: ['name', 'controller', 'model'],
            info: { attrs: ['name', '$content'] },
            item: { attrs: ['min', 'max', 'color', 'label'] }
        }
    };

    xmlparser.readFile(basePathXml + 'data.xml', structure ).then(function(data){
        expect(data['section'][0].name).toBe("view");
        expect(data['section'][1].name).toBe("values");
        expect(data['section'][2].name).toBe("composition");
        expect(data['section'][3].name).toBe("legend");
        expect(data['section'][4].name).toBe("detail");
        expect(data['section'][4]['info'].length).toBe(4);
        done();
    },function(e){

        expect(e).toBe(null);
    });
  });

  it("should be able to read from complex json structure.", function(done){
    var structure = {
        section: {
            attrs: ['name'],
            zone: {
                attrs: ['id', 'label'],
                Polygon : {
                    attrs: ['$isArray'],
                    outerBoundaryIs: {
                        coordinates: { attrs: ['$content'] }
                    },
                    innerBoundaryIs: {
                        coordinates: { attrs: ['$content'] }
                    }
                }
            }
        }
    };
    xmlparser.readFile(basePathXml + 'dataViewSample.xml', structure ).then(function(data){
        expect(data.section.zone[0].Polygon[0].innerBoundaryIs.coordinates.content).toBe('Omega');
        expect(data.section.zone[0].Polygon[0].outerBoundaryIs.coordinates.content).toBe('Delta');
        expect(data.section.zone[1].Polygon[0].outerBoundaryIs.coordinates.content).toBe('Blue');
        expect(data.section.zone[2].Polygon[0].outerBoundaryIs.coordinates.content.trim()).toBe('Alpha-Beta');
        expect(data.section.zone[2].Polygon[1].outerBoundaryIs.coordinates.content.trim()).toBe('Alpha');
        done();
    }, function(e){
        expect(e).toBe(null);
        done()
    });

  });

  it("should execute callback when certain element are ready", function(done){
    var structure = {
        section: {
            attrs: ['name'],
            zone: {
                attrs: ['id', 'label'],
                Polygon : {
                    attrs: ['$isArray'],
                    outerBoundaryIs: {
                        coordinates: { attrs: ['$content'] }
                    },
                    innerBoundaryIs: {
                        coordinates: { attrs: ['$content'] }
                    },
                    callback: function(poly){
                        expect(poly.innerBoundaryIs.coordinates.content).toBe('Omega');
                        done();
                    }
                }
            }
        }
    };

    xmlparser.readFile(basePathXml + 'dataViewSample.xml', structure ).then(
        function(data){
            expect(data).toEqual(jasmine.any(Object));
        }, 
        function(e){
            expect(e).toBe(null);
        });

  });
});
// });


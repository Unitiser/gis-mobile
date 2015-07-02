// var $injector = angular.injector(['ng','gisMobile', 'ngMock']);


describe("XML data parser service", function() {
  var basePathXml = '/base/lib/xmlDocuments/';
  var xmlparser, $httpBackend;

  beforeEach (module ('gis.xmlparser'));
  
  beforeEach(inject(function($injector) {
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    xmlparser = $injector.get('xmlparser');

    //Mock basic document
    $httpBackend.whenGET('/test/xml/basicdoc')
        .respond(function(method, url, data, headers){
            return [200, basicMock, {}]
        });

    //Mock invalid document
    $httpBackend.whenGET('/test/xml/invaliddoc')
        .respond(function(method, url, data, headers){
            return [200, invalidMock, {}]
        });

    //Mock complex document
    $httpBackend.whenGET('/test/xml/complexdoc').respond(function(method, url, data, headers){
        return [200, complexMock, {}]
    })
   }));


  it("should be able to load an xml file", function(done) {
    $httpBackend.expectGET('/test/xml/basicdoc');
    xmlparser.loadFile('/test/xml/basicdoc').then(function(file){
        expect(file).not.toBe(null);
        done();
    }, function(e){
        console.log(e);
        expect(e).toBe(null);
        done();
    });
    $httpBackend.flush();
  });

  it("should be able to tell if file is valid xml", function(done){
    $httpBackend.expectGET('/test/xml/basicdoc');
    xmlparser.parseFile('/test/xml/basicdoc').then(function(fileContent){
        expect(fileContent).not.toBe(null)
        done()
    },
    function(e){
        console.log(e);
        expect(e).toBe(null);
        done();
    });
    $httpBackend.flush();
  });

  it("should be able to tell if a file is invalid", function(done){
    $httpBackend.expectGET('/test/xml/invaliddoc');
    xmlparser.parseFile('/test/xml/invaliddoc').then(function(fileContent){
        expect(fileContent).toBe(null);
        done()
    },
    function(e){
        expect(e).toBe('INVALID XML');
        done();
    });
    $httpBackend.flush();
  });

  it("should be able to read data from simple json structure.", function(done){
    $httpBackend.expectGET('/test/xml/basicdoc');
    var structure = {
    'section': {
            attrs: ['name', 'controller', 'model'],
            info: { attrs: ['name', '$content'] },
            item: { attrs: ['min', 'max', 'color', 'label'] }
        }
    };

    xmlparser.readFile('/test/xml/basicdoc', structure ).then(function(data){
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
    $httpBackend.flush();
  });

  it("should be able to read xml directly", function(){
    var structure = {
    'section': {
            attrs: ['name', 'controller', 'model'],
            info: { attrs: ['name', '$content'] },
            item: { attrs: ['min', 'max', 'color', 'label'] }
        }
    };
    xmlparser.readXML(basicMock, structure).then(function(data){
        expect(data['section'][0].name).toBe("view");
        expect(data['section'][1].name).toBe("values");
        expect(data['section'][2].name).toBe("composition");
        expect(data['section'][3].name).toBe("legend");
        expect(data['section'][4].name).toBe("detail");
        expect(data['section'][4]['info'].length).toBe(4);
        done();
    });
  });

  it("should be able to read from complex json structure.", function(done){
    $httpBackend.expectGET('/test/xml/complexdoc');
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
    xmlparser.readFile('/test/xml/complexdoc', structure ).then(function(data){
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
    $httpBackend.flush();
  });

  it("should execute callback when certain element are ready", function(done){
    $httpBackend.expectGET('/test/xml/complexdoc');
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

    xmlparser.readFile('/test/xml/complexdoc', structure ).then(
        function(data){
            expect(data).toEqual(jasmine.any(Object));
        }, 
        function(e){
            expect(e).toBe(null);
        });
    $httpBackend.flush();
  });


  var basicMock = '<document>' +
       '<section name="detail">' +
           '<info></info>' +
           '<info></info>' +
           '<info></info>' +
           '<info></info>' +
       '</section>' +
       '<section name="legend"></section>' +
       '<section name="composition"></section>' +
       '<section name="values"></section>' +
       '<section name="view"></section>' +
    '</document>';
  
  var invalidMock = '<document>' +
     '<section name="view"></section>' +
     '<section name="values"></section>' +
     '<section name="composition"></section>' +
     '<section name="legend"></section>' +
     '<section name="detail">' +
         '<info></info>' +
         '<info></info>' +
         '<info></info>' +
         '<info></info>' +
  'This should not be here...';

  var complexMock = '<?xml version="1.0" ?>' +
  '<document>' +
    '<section name="view" controller="ViewSectionController" model="ViewSectionModel">' +
       '<view extent="348660.625 -5158981.5 120136.4375 108345">' +
              '<layers>' +
                  '<!-- Zone Layer -->' +
                  '<layer name="zone" layer="ZoneLayer" controller="ZoneLayerController" model="ZoneLayerModel">' +
                      '<zone id="z0" label="Kingsey Falls" xmlns:gml="http://www.opengis.net/gml" >' +
                          '<gml:MultiPolygon srsName="EPSG:32188"><gml:polygonMember><gml:Polygon><gml:outerBoundaryIs><gml:LinearRing><gml:coordinates>Alpha </gml:coordinates></gml:LinearRing></gml:outerBoundaryIs></gml:Polygon></gml:polygonMember><gml:polygonMember><gml:Polygon><gml:outerBoundaryIs><gml:LinearRing><gml:coordinates>Alpha-Beta</gml:coordinates></gml:LinearRing></gml:outerBoundaryIs></gml:Polygon></gml:polygonMember></gml:MultiPolygon>' +
                      '</zone>' +
                      '<zone id="z1" label="Arthabaska zone 1" xmlns:gml="http://www.opengis.net/gml" >' +
                          '<gml:Polygon srsName="EPSG:32188"><gml:outerBoundaryIs><gml:LinearRing><gml:coordinates>Blue</gml:coordinates></gml:LinearRing></gml:outerBoundaryIs></gml:Polygon>' +
                      '</zone>' +
                      '<zone id="z2" label="Arthabaska zone 2" xmlns:gml="http://www.opengis.net/gml" >' +
                          '<gml:Polygon srsName="EPSG:32188"><gml:outerBoundaryIs><gml:LinearRing><gml:coordinates>Delta</gml:coordinates></gml:LinearRing></gml:outerBoundaryIs><gml:innerBoundaryIs><gml:LinearRing><gml:coordinates>Omega</gml:coordinates></gml:LinearRing></gml:innerBoundaryIs></gml:Polygon>' +
                      '</zone>' +
                  '</layer>' +
              '</layers>' +
          '</view>' +
      '</section>' +
  '</document>';
});

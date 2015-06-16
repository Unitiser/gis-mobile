var $injector = angular.injector(['ng','gisMobile']);


describe("XML data parser service", function() {
  var basePathXml = '/base/lib/xmlDocuments/';
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
    var polygonStructure = {
            attrs: ['srsName'],
            outerBoundaryIs: {
                LinearRing: {
                    coordinates: { attrs: ['$content'] }
                }
            },
            innerBoundaryIs: {
                LinearRing: {
                    coordinates: { attrs: ['$content'] }
                }
            }
        };
    var structure = {
        section: {
            attrs: ['name'],
            view: {
                attrs: ['extent'],
                layers: {
                    layer: {
                        zone: {
                            attrs: ['id', 'name'],
                            MultiPolygon: {
                                attrs: ['srsName'],
                                polygonMember: {
                                    Polygon: polygonStructure
                                }
                            },
                            Polygon: polygonStructure
                        }
                    }
                }
            }
        }
    };

    xmlparser.readFile(basePathXml + 'dataViewSample.xml', structure ).then(function(data){
        console.log(data['section'][0]['view'][0]['layers'][0]['layer'][0]['zone'][0]['Polygon'][0]['outerBoundaryIs'][0]['LinearRing'][0]['coordinates'][0]);
        console.log(data['section'][0]['view'][0]['layers'][0]['layer'][0]['zone'][1]['Polygon'][0]['outerBoundaryIs'][0]['LinearRing'][0]['coordinates'][0]);
        console.log(data['section'][0]['view'][0]['layers'][0]['layer'][0]['zone'][2]['Polygon'][0]['outerBoundaryIs'][0]['LinearRing'][0]['coordinates'][0]);
        console.log(data['section'][0]['view'][0]['layers'][0]['layer'][0]['zone'][2]['MultiPolygon'][0]['polygonMember'][0]['Polygon'].length);
        expect(structure).toBe('complex ...');
        done();
    }, function(e){
        expect(e).toBe(null);
        done()
    });

  });

  it("should execute callback when ready certain element.", function(){
    expect(false).toBe(true);
  });
});
// });


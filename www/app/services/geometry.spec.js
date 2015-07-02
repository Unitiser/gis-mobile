describe('Geometry service', function(){
    var $q, $rootScope, Geometry;
    beforeEach(inject(function(_$q_,_$rootScope_,_Geometry_){
        $q = _$q_;
        $rootScope = _$rootScope_;
        Geometry = _Geometry_;
    }));
    beforeEach(module('gisMobile', function($provide){
        xmlParserMock;
        localStorageMock;
    }));
    it('should load geometry from file');
    it('should load geometry from cache');
    it('should be able to change projection');
    it('should validate the cached version against the structure document');
});
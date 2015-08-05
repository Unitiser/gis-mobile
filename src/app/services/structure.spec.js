describe('Structure', function(){
    var Structure, $rootScope, MOCKS;
    var localStorageMock;

    beforeEach(function(){
        module('gisMobile');
        module('gisMobileMocks');

        inject(function(_$rootScope_, _Structure_, _MOCKS_, _localStorage_){
            Structure = _Structure_;
            $rootScope = _$rootScope_;
            MOCKS = _MOCKS_;
            localStorageMock = _localStorage_;
        });
    });

    it('should load from remote xml', function(done){
        Structure.getFromRemote()
        .then(function(structure){

        })
    });

    it('should load from localStorage');
    it('should return categories');
    it('should return geometry');
    it('should return indicators by categories');
});
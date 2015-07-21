describe('Preloading', function(){
    var Preload, $rootScope, MOCKS, $cordovaNetwork;
    var localStorageMock;

    beforeEach(module('gisMobile'));

    beforeEach(inject(function(_$rootScope_, _Preload_, _MOCKS_, _$cordovaNetwork_){
        Preload = _Preload_;
        $rootScope = _$rootScope_;
        MOCKS = _MOCKS_;
        $cordovaNetwork = _$cordovaNetwork_;
    }));

    it('should check if network is availlable', function(done){
        spyOn($cordovaNetwork, 'isOnline').and.callThrough();
        Preload.checkNetwork()
        .then(function(isOnline){
            expect($cordovaNetwork.isOnline).toHaveBeenCalled();
        })
        .finally(done);
        $rootScope.$digest();
    });

    it('should verify that the geometry is valid');
    it('should verify that the indicator with alerts are valid');
    it('should reload invalid geometry');
    it('should reload invalid indicator');

    // it('should tell what indicator are cached'); //Doesn't need to be done in precache ...
});
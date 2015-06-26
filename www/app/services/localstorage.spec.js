describe("localStorage service", function() {
    var localStorage;
    beforeEach(module('gisMobile'));
    beforeEach(inject(function($injector){
        localStorage = $injector.get('localStorage');
    }));

    // it('should be able to open a pouchdb', function(done){
        
    // });

    // it('should be able to put something in the database');

    // it('should be able to reset the database');
});
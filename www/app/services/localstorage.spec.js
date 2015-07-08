describe("localStorage service", function() {
    var localStorage, $rootScope, MOCKS;

    beforeAll(function(done){
        expect(PouchDB).not.toBe(null);
        var reset = new PouchDB('gisMobile').destroy().then(done); // Reset cache
    });

    beforeEach(module('gisMobile'));
    beforeEach(inject(function($injector){
        localStorage = $injector.get('localStorage');
        $rootScope = $injector.get('$rootScope');
        MOCKS = $injector.get('MOCKS');
    }));

    it('should tell if structure does not exists', function(done){
       localStorage.getStructure()
        .then(function(struct) { expect(struct).toBe(null); })
        .catch(function(e){ expect(e.name).toBe('not_found'); })
        .finally(done);
        forceDigest();
    });

    it('should be able to save a structure document', function(done){
        localStorage.saveStructure(MOCKS.structure)
        .then(function(res) {expect(res.ok).toBe(true); })
        .catch(function(e){ expect(e).toBe(null); })
        .finally(done);
        forceDigest();
    });

    it('should be able to get a structure document', function(done){
        localStorage.getStructure()
        .then(function(struct) { 
            expect(struct.category[0].name).toBe(MOCKS.structure.category[0].name);
            expect(struct.geometry.id).toBe('cdq');
        })
        .catch(function(e){ expect(e).toBe(null); })
        .finally(done);
        forceDigest();
    });


    it('should tell if an indicator does not exists', function(done){
       localStorage.getIndicator('primary')
        .then(function(ind) { expect(ind).toBe(null); })
        .catch(function(e){ expect(e.name).toBe('not_found'); })
        .finally(done);
        forceDigest();
    });

    it('should be able to save an indicator', function(done){
       localStorage.saveIndicator(MOCKS.indicator)
        .then(function(res) { expect(res.ok).toBe(true); })
        .catch(function(e){ expect(e).toBe(null); })
        .finally(done);
        forceDigest();
    });

    it('should be able to get an indicator', function(done){
       localStorage.getIndicator('primary')
        .then(function(indicator) { expect(indicator.label).toBe('Primaire'); })
        .catch(function(e){ expect(e).toBe(null); })
        .finally(done);
        forceDigest();
    });

    it('should tell if a geometry exists', function(done){
       localStorage.getGeometry()
        .then(function(res) { expect(res).toBe(null); })
        .catch(function(e){ expect(e.name).toBe('not_found'); })
        .finally(done);
        forceDigest();
    });

    it('should be able to save a geometry', function(done){
        localStorage.saveGeometry(MOCKS.geometry)
        .then(function(res){expect(res.ok).toBe(true)})
        .catch(function(e){ expect(e).toBe(null)})
        .finally(done);
        forceDigest();
    });

    it('should be able to get a geometry', function(done){
        localStorage.getGeometry()
        .then(function(geo){ expect(geo.version.content).toBe('1.0')})
        .catch(function(e){ expect(e).toBe(null) })
        .finally(done);
        forceDigest();
    });

    it('should be able to flush a geometry', function(done){
        localStorage.flushGeometry()
        .then(function(res){ expect(res.ok).toBe(true); })
        .catch(function(e){ expect(e).toBe(null); })
        .finally(done);
        forceDigest();
    });

    function forceDigest(time){
        if(!time) time = 30;
        setTimeout(function() { $rootScope.$digest(); }, time);
    }
});

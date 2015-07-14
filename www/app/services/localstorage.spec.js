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
        .then(expectNull)
        .catch(function(e){ expect(e.name).toBe('not_found'); })
        .finally(done);
        forceDigest();
    });

    it('should be able to save a structure document', function(done){
        localStorage.saveStructure(MOCKS.structure)
        .then(expectOk).catch(expectNull).finally(done);
        forceDigest(60);
    });

    it('should be able to get a structure document', function(done){
        localStorage.getStructure()
        .then(function(struct) { 
            expect(struct.category[0].name).toBe(MOCKS.structure.category[0].name);
            expect(struct.geometry.id).toBe('cdq');
        })
        .catch(expectNull)
        .finally(done);
        forceDigest();
    });


    it('should tell if an indicator does not exists', function(done){
       localStorage.getIndicator('primary')
        .then(expectNull)
        .catch(function(e){ expect(e.name).toBe('not_found'); })
        .finally(done);
        forceDigest();
    });

    it('should be able to save an indicator', function(done){
       localStorage.saveIndicator(MOCKS.indicator)
        .then(function(res) { expect(res.ok).toBe(true); })
        .catch(expectNull)
        .finally(done);
        forceDigest();
    });

    it('should be able to get an indicator', function(done){
       localStorage.getIndicator('primary')
        .then(function(indicator) { expect(indicator.label).toBe('Primaire'); })
        .catch(expectNull)
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
        .then(expectOk).catch(expectNull)
        .finally(done);
        forceDigest();
    });

    it('should be able to get a geometry', function(done){
        localStorage.getGeometry()
        .then(function(geo){ expect(geo.version.content).toBe('1.0')})
        .catch(expectNull).finally(done);
        forceDigest();
    });

    it('should be able to flush a geometry', function(done){
        localStorage.flushGeometry()
        .then(expectOk).catch(expectNull)
        .finally(done);
        forceDigest();
    });

    it('should be able to save an alert', function(done){
        localStorage.saveAlert(MOCKS.alerts[0])
        .then(expectOk).catch(expectNull)
        .finally(done);
        forceDigest();
    });

    it('should handle the ids and avoid collisions ("alert" + ranNum)', function(done){
        var expectIdValue = function(res){
            expect(!!res.id.match(/alert-([0-9]|[a-f]){6}/g)).toBe(true);
            if(!res.id.match(/alert-([0-9]|[a-f]){6}/g))
                console.log('I\'d did not match regex : ' + res.id);
        }
        localStorage.saveAlert(MOCKS.alerts[0]).then(expectIdValue).catch(expectNull);
        localStorage.saveAlert(MOCKS.alerts[1]).then(expectIdValue).catch(expectNull).finally(done);
        forceDigest();
    });
    
    it('should be albe to list all alerts', function(done){
        localStorage.listAlerts()
        .then(function(alerts) { expect(alerts.length).toBe(3);  })
        .catch(expectNull).finally(done);
        forceDigest();
    });

    it('should be able to remove an alert', function(done){
        localStorage.listAlerts().then(function(alerts){
            localStorage.removeAlert(alerts[0].id).then(expectOk).catch(expectNull).finally(done); 
            forceDigest();
        });
        forceDigest();
    });

    it('should be able to flush all alerts', function(done){
        localStorage.flushAlerts().then(function(res){
            localStorage.listAlerts().then(function(alerts){ expect(alerts.length).toBe(0); }).catch(expectNull).finally(done);
            forceDigest(50);
        });
        forceDigest(30);
        forceDigest(60);
    });

    function forceDigest(time){
        if(!time) time = 30;
        setTimeout(function() { $rootScope.$digest(); }, time);
    }

    function expectNull(e){ expect(e).toBe(null); }
    function expectOk(res){ expect(res.ok).toBe(true); } 
});

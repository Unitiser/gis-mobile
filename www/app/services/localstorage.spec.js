describe("localStorage service", function() {
    var localStorage, $rootScope;

    beforeAll(function(done){
        expect(PouchDB).not.toBe(null);
        var reset = new PouchDB('gisMobile').destroy().then(done); // Reset cache
    });

    beforeEach(module('gisMobile'));
    beforeEach(inject(function($injector){
        localStorage = $injector.get('localStorage');
        $rootScope = $injector.get('$rootScope');
    }));

    it('should tell if structure does not exists', function(done){
       localStorage.getStructure()
        .then(function(struct) { expect(struct).toBe(null); })
        .catch(function(e){ expect(e.name).toBe('not_found'); })
        .finally(done);
        forceDigest();
    });

    it('should be able to save a structure document', function(done){
        localStorage.saveStructure(sampleStructure)
        .then(function(res) {expect(res.ok).toBe(true); })
        .catch(function(e){ expect(e).toBe(null); })
        .finally(done);
        forceDigest();
    });

    it('should be able to get a structure document', function(done){
        localStorage.getStructure()
        .then(function(struct) { 
            expect(struct.category[0].name).toBe(sampleStructure.category[0].name);
            expect(struct.geometry.name).toBe('cdq');
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
       localStorage.saveIndicator(sampleIndicator)
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
        localStorage.saveGeometry(sampleGeometry)
        .then(function(res){expect(res.ok).toBe(true)})
        .catch(function(e){ expect(e).toBe(null)})
        .finally(done);
        forceDigest();
    });

    it('should be able to get a geometry', function(done){
        localStorage.getGeometry()
        .then(function(geo){ expect(geo.zone[0].name).toBe('First zone')})
        .catch(function(e){ expect(e).toBe(null) })
        .finally(done);
        forceDigest()
    });

    function forceDigest(){
        setTimeout(function() { $rootScope.$digest(); }, 30);
    }


    var sampleStructure = {
        category: [{
            name: 'activity_sector',
            label: "Emplois par secteur d'activité",
            indicator: [{
                name: 'primary',
                label: 'Primaire',
                version: "1.0",
                url: "http://108.163.190.66/prototype/atlas_eq_2015/engine_data/emplois/2011/s_a_t_1_2011.xml"
            }, {
                name: "secondary",
                label: "Secondaire",
                version: "1.0",
                url: "http://108.163.190.66/prototype/atlas_eq_2015/engine_data/emplois/2011/s_a_t_2_2011.xml"
            },{
                name: "production_service",
                label: "Service à la production",
                version: "1.0",
                url: "http://108.163.190.66/prototype/atlas_eq_2015/engine_data/emplois/2011/s_a_t_4_2011.xml"
            }]
        },{
            name: 'competency_level',
            label: 'Emplois par niveau de compétence',
            indicator: [{
                name: "management",
                label: "Gestion",
                version: "1.0",
                url: "http://108.163.190.66/prototype/atlas_eq_2015/engine_data/emplois/2011/n_c_t_1_2011.xml"
            }]
        }],
        geometry: {
            name: "cdq",
            label: "Centre-du-Québec",
            version: "1.0"
        }
    };

    var sampleIndicator = {
        name: 'primary',
        label: 'Primaire',
        description: 'This is a description',
        param: [{
            name: 'men',
            type: 'Integer',
            content: 'Number of men in the region'
        },{
            name: 'women',
            type: 'Integer',
            content: 'Number of women in the region'
        }],
        value: [{
            z: 'z0',
            men: '100',
            women: '200'
        },{
            z: 'z1',
            men: '200',
            women: '100'
        }],
        legend: [{
            for: "map",
            item: [{
                min: '0',
                max: '100',
                color: 'yellow',
                content: '0 à 100'
            },{
                min: '101',
                max: '200',
                color: 'red',
                content: '101 à 200'
            }]
        }],
        version: {
            date: '10/20/2012',
            content: '1.0'
        }
    };

    var sampleGeometry = {
        zone: [{
            id: 'z0',
            name: 'First zone',
            description: 'Something',
            Polygon: {
                exterior: { posList: '20 30, 30 40, 40 20, ...' },
                interior: [{ posList: '...' }, { posList: '...' }]
            }
        }],
        version: {
            date: '20/10/2012',
            content: '1.0'
        }


    };
});

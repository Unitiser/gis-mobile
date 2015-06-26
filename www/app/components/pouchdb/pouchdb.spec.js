describe("pouchdb service", function() {
    var $pouchdb, $rootScope;

    var sampleDoc = {
            _id: 'something',
            value: 'something'
    };

    beforeEach(module('gis.pouchdb'));
    beforeEach(inject(function($injector){
        $pouchdb = $injector.get('$pouchdb');
        $rootScope = $injector.get('$rootScope');
    }));

    it('should be able to open a db', function(done){
        $pouchdb.openDatabase('supertest')
        .then(function(info){
            console.log(info);
            expect(info.db_name).toBe('supertest');
        })
        .catch(function(e){
            expect(e).toBe(null);
        })
        .finally(done);

        setTimeout(function() { $rootScope.$digest(); }, 50);
    });

    it('should be able to put something in the database', function(done){
        $pouchdb.openDatabase('supertest');
        $pouchdb.put(sampleDoc)
        .then(function(doc){ expect(doc.value).toBe('something'); })
        .catch(function(e){ expect(e).toBe(null) })
        .finally(done);
        setTimeout(function() { $rootScope.$digest(); }, 30);
    });

    it('should be able to retreive something from the database', function(done){
        
    });

    it('should be able to reset the database');
});
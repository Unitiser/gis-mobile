describe("pouchdb service", function() {
    var $pouchdb, $rootScope;

    var sampleDoc = {
            _id: 'something',
            value: 'something'
    };

    //Delete the database before we start the tests.
    beforeAll(function(done){
        expect(PouchDB).not.toBe(null);
        var db = new PouchDB('supertest');
        db.destroy().then(done);
    });


    beforeEach(module('gis.pouchdb'));
    beforeEach(inject(function($injector){
        $pouchdb = $injector.get('$pouchdb');
        $rootScope = $injector.get('$rootScope');
    }));

    it('should be able to open a db', function(done){
        $pouchdb.openDatabase('supertest')
        .then(function(info){ expect(info.db_name).toBe('supertest'); })
        .catch(function(e){ expect(e).toBe(null); })
        .finally(done);
        forceDigest();
    });

    it('should be able to put something in the database', function(done){
        $pouchdb.openDatabase('supertest');
        $pouchdb.put(sampleDoc)
        .then(function(res){ 
            expect(res.ok).toBe(true); })
        .catch(function(e){ expect(e).toBe(null) })
        .finally(done);
        forceDigest();
    });

    it('should be able to retreive something from the database', function(done){
        $pouchdb.openDatabase('supertest');
        $pouchdb.get('something')
        .then(function(something){ expect(something.value).toBe('something'); })
        .catch(function(e){ expect(e).toBe(null); })
        .finally(done);
        forceDigest();
    });

    it('should be able to reset the database', function(done){
        $pouchdb.openDatabase('supertest');
        $pouchdb.resetDatabase()
        .then(function(){
            $pouchdb.get('something')
            .then(function(something){ expect(something).toBe(null) })
            .catch(function(e){ expect(e.name).toBe('not_found') })
            .finally(done);
            forceDigest();
        });
        forceDigest();
    });

    it('should be able to remove a document', function(done){
        $pouchdb.openDatabase('supertest');
        $pouchdb.put(sampleDoc)
        .then(function(res){
            forceDigest();
            return $pouchdb.remove('something');
        })
        .then(function(res){
            forceDigest();
            return $pouchdb.get('something');
        })
        .catch(function(e){ expect(e.name).toBe('not_found'); done(); });
        forceDigest();
    });

    it('should be able to list all doc with value in id', function(done){
        $pouchdb.openDatabase('supertest');
        $pouchdb.put({_id: 'something1'});
        $pouchdb.put({_id: 'something2'}).then(function(){
            $pouchdb.listAllIdWith('something').then(function(res){
                expect(res.total_rows).toBe(2);
                done();
            });
            forceDigest();
        });
        forceDigest();
    });

    function forceDigest(time){
        if(!time) time = 50;
        setTimeout(function() { $rootScope.$digest(); }, time);
    }
});
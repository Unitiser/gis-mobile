describe('Alert comparator', function(){
    var Alert;
    beforeEach(module('gisMobile'));
    beforeEach(inject(function(_Alert_){
        Alert = _Alert_;
    }));

    it('isEqual should tell if the value is equal', function(){
        var isEqual = Alert.getComparator('isEqual', 10);
        expect(isEqual(10)).toBe(true);
        expect(isEqual(11)).toBe(false);
    });

    it('isSmallerThan should tell if value is smaller', function(){
        var isSmallerThan = Alert.getComparator('isSmaller', 10);
        expect(isSmallerThan(9)).toBe(true);
        expect(isSmallerThan(11)).toBe(false);
        expect(isSmallerThan(10)).toBe(false);
    });

    it('isGreaterThan should tell if value is greater', function(){
        var isGreaterThan = Alert.getComparator('isGreater', 10);
        expect(isGreaterThan(11)).toBe(true);
        expect(isGreaterThan(9)).toBe(false);
        expect(isGreaterThan(10)).toBe(false);
    });
    
    it('isBetween should tell if value is between', function(){
        var isBetween = Alert.getComparator('isBetween', 5, 10);
        expect(isBetween(7)).toBe(true);
        expect(isBetween(4)).toBe(false);
        expect(isBetween(11)).toBe(false)
        expect(isBetween(5)).toBe(true)
        expect(isBetween(10)).toBe(true);
    });
    
    it('should work when we define multiple comparators', function(){
        var isEqual = Alert.getComparator('isEqual', 20);
        var isGreater = Alert.getComparator('isGreater', 10);
        expect(isEqual(20)).toBe(true);
        expect(isEqual(10)).toBe(false);
        expect(isGreater(20)).toBe(true);
        expect(isGreater(10)).toBe(false);
    });
    
    it('should have a parsable toString', function(){
        var isEqual = Alert.getComparator('isEqual', 20);
        expect(isEqual.toString()).toBe('isEqual 20');
        var isBetween = Alert.getComparator('isBetween', 10, 20);
        expect(isBetween.toString()).toBe('isBetween 10,20')
    });
    
    it('shoud parse a string version of comparator', function(){
        var isEqual = Alert.getComparator('isEqual 20');
        expect(isEqual(20)).toBe(true);
        var isBetween = Alert.getComparator('isBetween 10,20');
        expect(isBetween(15)).toBe(true);
    });
});

describe('Alert object', function(){
    var Alert, $q, $rootScope, MOCKS, localStorageMock;
    beforeEach(module('gisMobile', function($provide){
        var indicatorMock = {
            getLocal: function(id){
                var defer = $q.defer();
                defer.resolve(MOCKS.indicator);
                return defer.promise;
            }
        };
        localStorageMock = { saveAlert: function(alert){  } }; 
        $provide.value('Indicator', indicatorMock);
        $provide.value('localStorage', localStorageMock);

    }));
    beforeEach(inject(function(_Alert_, _$q_, _MOCKS_, _$rootScope_){
        Alert = _Alert_;
        $q = _$q_;
        MOCKS = _MOCKS_;
        $rootScope = _$rootScope_;
    }));

    it('zoneParam should check if alert is thrown', function(done){
        var comparator = function(value){
            expect(value).toBe(100);
            return true;
        }
        var typedAlert = Alert.create('zoneParam', comparator, 'primary', 'men', 'z0');
        typedAlert.isThrown().then(function(result){ expect(result).toBe(true); }).finally(done);
        $rootScope.$apply();
    });

    it('totalParam should check if alert is thrown', function(done){
        var comparator = function(value){
            expect(value).toBe(300);
            return true;
        };
        var typedAlert = Alert.create('totalParam', comparator,'primary', 'men');
        typedAlert.isThrown().then(function(result){ expect(result).toBe(true); }).finally(done);
        $rootScope.$apply();
    });

    it('should take a string\'d comparator', function(done){
        var alert = Alert.create('totalParam', 'isEqual 300', 'primary', 'men');
        alert.isThrown().then(function(result){ expect(result).toBe(true); }).finally(done);
        $rootScope.$apply();
    });

    it('totalParam should serialize itself', function(){
        var alert = Alert.create('totalParam', 'isEqual 300', 'primary', 'men');
        var serialize = alert.serialize();

        expect(serialize.type).toBe('totalParam');
        expect(serialize.comparator).toBe('isEqual 300');
        expect(serialize.params[0]).toBe('primary');
        expect(serialize.params[1]).toBe('men');
    });

    it('zoneParam should serialize itself', function(){
        var alert = Alert.create('zoneParam', 'isEqual 300', 'primary', 'men', 'z0');
        var serialize = alert.serialize();

        expect(serialize.type).toBe('zoneParam');
        expect(serialize.comparator).toBe('isEqual 300');
        expect(serialize.params[0]).toBe('primary');
        expect(serialize.params[1]).toBe('men');
        expect(serialize.params[2]).toBe('z0');
    });

    it('should be able to recreate alert from serialize object', function(done){
        var alert = Alert.create(MOCKS.savedAlerts[0]);
        alert.isThrown().then(function(result){expect(result).toBe(true)}).finally(done);
        $rootScope.$apply();
    });

    it('totalParam should be able to dismiss itself', function(done){
        var alert = Alert.create(MOCKS.savedAlerts[0]);
        alert.dismiss();
        alert.isThrown().then(function(isThrown){ expect(isThrown).toBe(false); }).finally(done);
        $rootScope.$apply();
    });

    it('zoneParam should be able to dismiss itself', function(done){
        var alert = Alert.create(MOCKS.savedAlerts[1]);
        alert.dismiss();
        alert.isThrown().then(function(isThrown){ expect(isThrown).toBe(false); }).finally(done);
        $rootScope.$apply();
    });

    it('totalParam should be able to resolve itself', function(done){
        console.log('Trying to resolve alert');
        localStorageMock.saveAlert = function(alert){
            expect(alert.resolved).toBe('1.0');
        }

        var alert = Alert.create(MOCKS.savedAlerts[0]);
        alert.resolve('1.0');
        alert.isThrown().then(function(isThrown){ expect(isThrown).toBe(false) }).finally(done);
        $rootScope.$apply();
    });

    it('zoneParam should be able to resolve itself', function(done){
        var alert = Alert.create(MOCKS.savedAlerts[1]);
        alert.resolve('1.0');
        alert.isThrown().then(function(isThrown){ expect(isThrown).toBe(false) }).finally(done);
        $rootScope.$apply();
    });
});


describe('Alert service', function(){
    var Alert, $q, $rootScope, MOCKS;
    var localStorageMock;
    beforeEach(module('gisMobile', function($provide){
        localStorageMock = {
            saveAlert: function(alert){
                var defer = $q.defer();
                defer.resolve({ok: true});
                return defer.promise;
            },
            listAlerts: function(){
                var defer = $q.defer();
                defer.resolve(MOCKS.savedAlerts);
                return defer.promise;
            },
            removeAlert: function(id){
                var defer = $q.defer();
                defer.resolve({ok: true});
                return defer.promise;
            }
        };

        var indicatorMock = {
            get: function(id){
                var defer = $q.defer();
                defer.resolve(MOCKS.indicator);
                return defer.promise;
            }
        };

        spyOn(localStorageMock, 'saveAlert').and.callThrough();
        spyOn(localStorageMock, 'listAlerts').and.callThrough();
        spyOn(localStorageMock, 'removeAlert').and.callThrough();


        $provide.value('Indicator', indicatorMock);
        $provide.value('localStorage', localStorageMock);
    }));
    beforeEach(inject(function(_Alert_, _$q_, _MOCKS_, _$rootScope_){
        Alert = _Alert_;
        $q = _$q_;
        MOCKS = _MOCKS_;
        $rootScope = _$rootScope_;
    }));

    it('should create and save an alert', function(){
        var newAlert = Alert.create(MOCKS.alerts[0]);
        expect(localStorageMock.saveAlert).toHaveBeenCalled();
    });
    it('should list alerts', function(done){
        Alert.list().then(function(alerts){
            expect(localStorageMock.listAlerts).toHaveBeenCalled();
            expect(alerts.length).toBe(2);
            done()
        });
        $rootScope.$apply();
    });
    
    it('should remove an alert', function(){
        Alert.remove(MOCKS.savedAlerts[0]);
        expect(localStorageMock.removeAlert).toHaveBeenCalled();
    });
});



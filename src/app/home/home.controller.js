angular.module('gisMobile').controller("HomeCtrl", function($scope, Indicator, Alert, Auth, $http, Preload, Structure, $ionicPopup, $rootScope){
    // Load the external data during the splash screen
    $scope.$on('$ionicView.loaded', function() { ionic.Platform.ready( init ); });

    $scope.$on('$ionicView.enter', function(){
        if($rootScope.isReloadForced == true){
            $rootScope.isReloadForced = false;
            init();
        }
    });



    function init(){
        Logger.time('Loading categories');
        return Preload.go()
        .catch(function(e){
            switch(e.name){
                case 'not_connected':
                    // Do nothing yet, we'll be able to proceed with localStorage if cached data exist.
                    $scope.isOffline = true;
                break;
                case 'not_authenticated':
                    // Ask user to connect
                    $scope.notLoggedIn = true;
                break;
                case 'structure_not_found': 
                    $scope.hollowOffline = true;
                break;
                case 'geometry_not_found' :
                    // TODO : Determine what to do in this case
                    $scope.geometryNotFound = true;
                break;
                default :
                    Logger.warn('Unhandle preloading error');
                    console.log(e);
                break;
            }
        })
        .then(loadStructure)
        .then(loadAlerts)
        .finally(addStaticMenuItems);
    }

    function loadStructure(){
        return Structure.getCategories().then(function(cats){
            if($scope.notLoggedIn)
                $scope.usingCache = true;

            $scope.items = prepareCategories(cats);
        })
        .catch(function(e){ 
            Logger.warn('Structure not in local storage.');
            $scope.items = [];
            $scope.hollowOffline = true;
        });
    }

    function loadAlerts(){
        return Alert.list()
        .then(function(alerts){
            $scope.alerts = [];
            _.forEach(alerts, function(a, index){
                var myAlert = Alert.create(a);
                if(myAlert.isThrown){

                    console.log(myAlert.toString());
                    myAlert.toString().then(function(value){
                        $scope.alerts.push({ 
                            value : value,
                            resolve: function(){
                                console.log('Executing resolve');
                                myAlert.remove();
                            }
                        });
                    });
                }
            });
        })
        .catch(function(e){
            // TODO : Handle error
            Logger.warn('Error while loading the alerts');
        });
    }

    function addStaticMenuItems(){
        $scope.items.push({
            name: 'Paramètres',
            icon: 'ion-gear-b',
            link: '/settings'
        });
    }

    function prepareCategories(cats){
        categories = [];
        for (var i = cats.length - 1; i >= 0; i--) {
            categories.push({
                name: cats[i].label,
                icon: 'ion-map',
                link: '/cat/indicators/' + cats[i].id,
            });
        };
        return categories;
    }

    function login(){
        $scope.notLoggedIn = false;
        $scope.hollowOffline = false;
        $scope.hasUnexpectedLoginError = false;
        Auth.login('my-user', 'my-password')
        .catch(function(e){
            console.log(JSON.stringify(e));
            $scope.hasUnexpectedLoginError = true;
        })
        .finally(init);
    }

    // Display login popup
    $scope.openLoginPopup = function(){
        //Init child scope
        var modalScope = $scope.$new(true);

        //Default values
        modalScope.user = {
            username : '',
            password : ''
        }

        //Show popup
        $ionicPopup.show({
            templateUrl : 'app/home/login.modal.html',
            scope : modalScope,
            title : "S'authentifier",
            buttons : [{
                text : 'Annuler'
            },{
                text : 'Confimer',
                type : 'button-positive',
                onTap : function(e){ return modalScope.user; }
            }]
        })
        .then(function(user){
            login(user.username, user.password);
        });
    }
});
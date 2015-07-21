angular.module('gisMobile').controller("HomeCtrl", function($scope, Indicator, Geometry, Auth, $http, Preload){
    //Load the external data during the splash screen
    $scope.$on('$ionicView.loaded', function() {
      ionic.Platform.ready( function() {
        Logger.time('Loading categories');
        Preload.go()
        .then(function(){
            return Indicator.getCategories();
        })
        .then(function(cats){
            $scope.items = cats;
            $scope.items.push({
                name: 'Paramètres',
                icon: 'ion-gear-b',
                link: '/settings'
            });
        });
      });
    });

    $scope.login = function(){
        Auth.login();
    }

    $scope.testGet = function(){
        $http.defaults.headers.common.Authorization = "Bearer " + Auth.accessToken();
        $http.get('/testuser')
        .success(function(res){
            console.log(res);
        }).error(function(e){
            console.log(e);
        });
        $http.defaults.headers.common.Authorization = "Basic";
    }

    $scope.testGetNoAccess = function(){
        
        $http.get('/nobody')
        .success(function(res){
            console.log(res);
        }).error(function(e){
            console.log(e);
        });

    }

    $scope.testIndex = function(){
        $http.get('/testindex')
        .success(function(res){
            console.log(res);
        }).error(function(e){
            console.log(e);
        });
    }

    $scope.testPreloadAlerts = function(){
        Preload.preloadAlerts();
    }

    $scope.testReloadStructure = function(){
        Preload.reloadStructure();
    }

    // $scope.testGetIndicator = function(){
    //     Indicator.get('sample')
    //     .then(function(indicator){
    //         console.log(indicator);
    //     })
    //     .catch(function(e){
    //         console.log(e);
    //     });
    // }

    // $scope.testValidateVersion = function(){
    //     Indicator.validate('sample')
    //     .then(function(isValid){
    //         console.log(isValid);
    //     })
    //     .catch(function(e){ console.log(e); });
    // }

    // $scope.testGeometry = function(){
    //     Geometry.get()
    //     .then(function(geo){ console.log(geo); });
    // }


});
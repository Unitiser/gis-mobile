angular.module('gisMobile').controller("HomeCtrl", function($scope, Indicator, Auth, $http){
    Indicator.getCategories()
    .then(function(cats){
        $scope.items = cats;
        $scope.items.push({
            name: 'Paramètres',
            icon: 'ion-gear-b'
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
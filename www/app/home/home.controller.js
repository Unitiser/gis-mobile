angular.module('gisMobile').controller("HomeCtrl", function($scope, data, Indicator, Auth, $http){
    $scope.items = [
        {
            name: 'Paramètres',
            icon: 'ion-gear-b'
        }
    ]

    data.getCategories(function(cats){
        _.each(cats,function(cat){
            $scope.items.unshift({
                name: cat.label,
                icon: 'ion-map',
                link: '/cat/indicators/' + cat.name
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
    // Indicator.tryLoadCats();


});
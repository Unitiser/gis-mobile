angular.module('gisMobile').controller('SettingsCtrl', function($scope, localStorage, Auth, $rootScope, $state){
    $scope.settings = [{
        name: 'Réinitialiser la mémoire',
        icon: 'ion-android-sync',
        action : function(){
            localStorage.reset()
            .then(function(){
                $rootScope.isReloadForced = true;
                $state.go('home');
            });
        }
    }, {
        name: 'Se déconnecter',
        icon: 'ion-locked',
        action : function(){
            Auth.logout()
            .then(function(){
                $rootScope.isReloadForced = true;
                $state.go('home');
            });
        }
    }]
});
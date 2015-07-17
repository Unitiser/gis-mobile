angular.module('gisMobile').controller('SettingsCtrl', function($scope, localStorage){
    $scope.settings = [{
        name: 'Réinitialiser la mémoire',
        icon: 'ion-android-sync',
        action : function(){
            localStorage.reset();
        }
    }]
});
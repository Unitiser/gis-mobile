angular.module('gisMobile').controller("HomeCtrl", function($scope){
    $scope.greeting = "Hello Ionic world!";
    $scope.items = [
        {
            name: 'Liste des indicateurs',
            icon: 'ion-ios-speedometer',
            link: '/indicator'
        },
        {
            name: 'Carte interactive',
            icon: 'ion-earth'
        },
        {
            name: 'Paramètres',
            icon: 'ion-gear-b'
        }
    ]
})
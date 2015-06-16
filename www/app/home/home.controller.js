angular.module('gisMobile').controller("HomeCtrl", function($scope, data){
    $scope.items = [
        // {
        //     name: 'Liste des indicateurs',
        //     icon: 'ion-ios-speedometer',
        //     link: '/indicators'
        // },
        // {
        //     name: 'Carte interactive',
        //     icon: 'ion-earth'
        // },
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
})
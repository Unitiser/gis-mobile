angular.module('gisMobile').service('Indicator',function(){
    var indicators = [{
        id: 'club',
        name: 'Club',
        icon: 'ion-wineglass',
        url: '/indicator/club'
    },{
        id: 'pizza',
        name: 'Pizzeria',
        icon: 'ion-pizza',
        url: '/indicator/pizza'
    },{
        id: 'coffee',
        name: 'Cafée',
        icon: 'ion-coffee',
        url: '/indicator/coffee'
    },{
        id: 'icecream',
        name: 'Bar laitier',
        icon: 'ion-icecream',
        url: '/indicator/icecream'
    },{
        id: 'bar',
        name: 'Bar',
        icon: 'ion-beer',
        url: '/indicator/bar'
    },{
        id: 'sport',
        name: 'Centre sportif',
        icon: 'ion-ios-football',
        url: '/indicator/sport'
    }];

    return {
        indicators: indicators,
        getIndicator: function(id){
            return _.find(indicators, {id: id});
        }
    }
});
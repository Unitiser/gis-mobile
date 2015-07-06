angular.module('gisMobile').service('Graph', function($q){
    //roduce a config for chartjs based on a legend

    function getConfig(indicator, geography, legend){
        switch(legend.for){
            case 'pieChart':
            break;
            case 'barChart':
            break;
        }        
    }

    function getPieChartConfig(){

    }

    function getBarChartConfig(){

    }

    function getTotalBarChartConfig(){

    }


    return {
        getConfig: getConfig
    }

});

// $scope.pieData = [{
//     value: 0,
//     label: "Homme",
//     color: '#1976d2',
//     highlight: '#1565c0'
// },{
//     value: 0,
//     label: "Femme",
//     color: '#ef5350',
//     highlight: '#f44336'
// }];

// legendPie : {
//     values: "men,women",
//     for: "pieChart",
//     item: [{
//         color: "#FFFFFF",
//         content: "Hommes"
//     },{
//         color: "#000000",
//         content: "Femmes"
//     }]
// }
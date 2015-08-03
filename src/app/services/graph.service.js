angular.module('gisMobile').service('Graph', function($q){
    //Produce a config for chartjs based on a legend
    var Log = Logger.get('Graph.service');
    function getConfig(indicator, geometry, legend){
        switch(legend.for){
            case 'pieChart':
                return getPieChartConfig(indicator, geometry, legend);
            break;
            case 'barChart':
                return getBarChartConfig(indicator, geometry, legend);
            break;
            case 'totalBarChart':
                return getTotalBarChartConfig(indicator, geometry, legend);
            break;
            default:
                Log.warn(legend.for + ' is not implemented');
            break
        }        
    }

    function getPieChartConfig(indicator, geometry, legend){
        var params = legend.values.split(',');
        var config = [];
        var totals = {}
        
        //Sum values
        _.forEach(indicator.value, function(val){
            for (var i = params.length - 1; i >= 0; i--) {
                if(!totals[params[i]]) totals[params[i]] = 0;
                totals[params[i]] += val[params[i]] * 1 ;
            };
        })
        
        //Build config
        for (var i = params.length - 1; i >= 0; i--) {
            config.push({
                value: totals[params[i]],
                label: legend.item[i].content,
                color: legend.item[i].color
                // highlight: darken(legend.item[i].color)
            });
        };

        return config;
    }

    function getBarChartConfig(indicator, geometry, legend){
        var params = legend.values.split(',');
        var config = {
            labels: [],
            datasets: []
        }
        var data = {};
        
        _.forEach(indicator.value, function(val){
            config.labels.push( _.find(geometry.domainSet.MultiSurface, {id: val.z}).name.content );
            
            for (var i = params.length - 1; i >= 0; i--) {
                if(!data[params[i]]) data[params[i]] = [];

                data[params[i]].push(val[params[i]]);
            };
        });

        //build datasets
        _.forEach(params, function(param, index){
            config.datasets.push({
                label: legend.item[index].content,
                fillColor: legend.item[index].color,
                strokeColor: legend.item[index].color,
                data: data[param]
            });
        });
        return config;
    }

    function getTotalBarChartConfig(indicator, geometry, legend){
        var params = legend.values.split(',');
        var config = {
            labels: [],
            datasets: []
        }
        var colors = [];
        var data = [];
        
        _.forEach(indicator.value, function(val){
            var total = 0;
            config.labels.push( _.find(geometry.domainSet.MultiSurface, {id: val.z}).name.content );
            
            for (var i = params.length - 1; i >= 0; i--) {
                total += (val[params[i]] * 1);
            };
            var color = getColor(total, legend);
            
            colors.push(color);
            data.push(total);
        });

        //build dataset
        config.datasets.push({
            label: 'Total',
            fillColor: colors,
            strokeColor: colors,
            data: data
        });

        return config;
    }


    //Utility functions
    function darken(hex){
        return changeColorLuminance(hex, -0.2);
    }

    function changeColorLuminance(hex, lum) {

        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        }
        lum = lum || 0;

        // convert to decimal and change luminosity
        var rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i*2,2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00"+c).substr(c.length);
        }

        return rgb;
    }

    function getColor(value, legend){
        for(var i = 0; i < legend.item.length; i++){
            if((value * 1) >= legend.item[i].min &&
                (value * 1) < legend.item[i].max ){
                return legend.item[i].color.replace('0x', '#');
            }
        }
    }


    //Public API
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
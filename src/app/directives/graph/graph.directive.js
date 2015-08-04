angular.module('gisMobile').directive('gisChart', function(){
    var Log = Logger.get('gis-chart');
    return {
        restrict: 'E',
        scope: {
            data: '=data',
            title: '=title',
            for: '=for'
        },
        templateUrl: "app/directives/graph/graph.template.html",
        link: function(scope, element, attrs){
        },
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                pre: function(){},
                post: function(scope, iElement, iAttrs, controller){
                    var data = scope.data;
                    var canvas = _.first(iElement.find('canvas'));
                    var chart;
                    switch(scope.for){
                        case 'pieChart':
                        case 'pieChartBy':
                            canvas.width = screen.width - 20;
                            canvas.height = 400;
                            var chart = new Chart(canvas.getContext("2d")).Pie(data, {legend : true, animation: false});
                        break;
                        case 'barChart':
                        case 'totalBarChart':
                            canvas.width = 1000;
                            canvas.height = 400;
                            var chart = new Chart(canvas.getContext("2d")).Bar(data, {legend : true, animation: false});
                        break;
                    }
                }
            }
        }
    }
});

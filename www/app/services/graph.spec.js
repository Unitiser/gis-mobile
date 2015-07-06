describe('Graph service', function(){
    var Graph, MOCKS;
    
    beforeEach(module('gisMobile'));
    
    beforeEach(inject(function(_Graph_, _MOCKS_){
        Graph = _Graph_;
        MOCKS = _MOCKS_;
    }));

    it('should format the data for a pieChart', function(){
        var config = Graph.getConfig(MOCKS.indicator, MOCKS.geography, MOCKS.legendPie);
        expect(config.length).toBe(2);
        expect(config.label).toExist();
        expect(config.value).toBe(300);
    });
    it('should format the data for a barChart');
    it('should format the data for a totalChart');
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
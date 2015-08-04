describe('Graph service', function(){
    var Graph, MOCKS;
    
    beforeEach(module('gisMobile'));
    
    beforeEach(inject(function(_Graph_, _MOCKS_){
        Graph = _Graph_;
        MOCKS = _MOCKS_;
    }));

    it('should format the data for a pieChart', function(){
        var config = Graph.getConfig(MOCKS.indicator, MOCKS.geometry, MOCKS.legendPie);
        expect(config.length).toBe(2);
        expect(config[1].label).toBe('Hommes');
        expect(config[1].value).toBe(300);
        expect(config[1].color).toBe('#FFFFFF');
    });

    it('should format the data for a barChart', function(){
        var config = Graph.getConfig(MOCKS.indicator, MOCKS.geometry, MOCKS.legendBar);
        expect(config.labels.length).toBe(2);
        expect(config.datasets.length).toBe(2);
        expect(config.datasets[0].label).toBe('Hommes');
        expect(config.datasets[0].fillColor).toBe('#FFFFFF');
        expect(config.datasets[0].data.length).toBe(2);
    });

    it('should format the data for a totalBarChart', function(){
        var config  = Graph.getConfig(MOCKS.indicator, MOCKS.geometry, MOCKS.legendTotal);
        expect(config.labels.length).toBe(2);
        expect(config.datasets.length).toBe(1);
        expect(config.datasets[0].label).toBe('Total');
        expect(config.datasets[0].fillColor.length).toBe(2);
        expect(config.datasets[0].data.length).toBe(2);
    });

    it('should format the data for a pieChartBy', function(){
        var config = Graph.getConfig(MOCKS.indicatorWithElement, MOCKS.geometry, MOCKS.legendPieChartBy);
        expect(config.length).toBe(3);
        expect(config[0].value).toBe(150000000);
        expect(config[0].label).toBe('CI');
        console.log(config);
    });
});


// [Object{value: 300, label: 'Femmes', color: '#000000'}, Object{value: 300, label: 'Hommes', color: '#FFFFFF'}]

// [{value: 1, label: 'UE', color: '#00ff00'},
// {value: 2, label: 'FIDA', color: '#0000ff'},
// {value: 3, label: 'CI', color: '#ff00ff'}]
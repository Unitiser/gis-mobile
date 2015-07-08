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
        expect(config.datasets[0].fillColor.length).toBe(2);
        expect(config.datasets[0].fillColor[0]).toBe('#FFFF00');
        expect(config.datasets[0].data.length).toBe(2);
    });

    it('should format the data for a totalChart');
});
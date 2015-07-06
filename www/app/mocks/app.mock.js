angular
.module('gisMobile', ['gis.xmlparser', 'gis.pouchdb'])
.constant('MOCKS', {

    structure : {
        category: [{
            id: 'activity_sector',
            label: "Emplois par secteur d'activité",
            indicator: [{
                id: 'primary',
                label: 'Primaire',
                version: "1.0",
                url: "http://108.163.190.66/prototype/atlas_eq_2015/engine_data/emplois/2011/s_a_t_1_2011.xml"
            }, {
                id: 'secondary',
                label: 'Secondaire',
                version: "1.0",
                url: "http://108.163.190.66/prototype/atlas_eq_2015/engine_data/emplois/2011/s_a_t_2_2011.xml"
            }]
        },{
            id: 'competency_level',
            label: 'Emplois par niveau de compétence',
            indicator: [{
                id: 'something',
                label: 'Else',
                version: "1.0",
                url: "http://108.163.190.66/prototype/atlas_eq_2015/engine_data/emplois/2011/s_a_t_1_2011.xml"
            }]
        }],
        geometry: {
            id: "cdq",
            label: "Centre-du-Québec",
            version: "1.0"
        }
    },

    indicator: {
        name: 'primary',
        label: 'Primaire',
        description: 'This is a description',
        param: [{
            name: 'men',
            type: 'Integer',
            content: 'Number of men in the region'
        },{
            name: 'women',
            type: 'Integer',
            content: 'Number of women in the region'
        }],
        value: [{
            z: 'z0',
            men: '100',
            women: '200'
        },{
            z: 'z1',
            men: '200',
            women: '100'
        }],
        legend: [{
            for: "map",
            item: [{
                min: '0',
                max: '100',
                color: 'yellow',
                content: '0 à 100'
            },{
                min: '101',
                max: '200',
                color: 'red',
                content: '101 à 200'
            }]
        }],
        version: {
            date: '10/20/2012',
            content: '1.0'
        }
    },

    indicatorSummary: {
        id: 'something',
        label: 'Else',
        version: "1.0",
        url: "http://108.163.190.66/prototype/atlas_eq_2015/engine_data/emplois/2011/s_a_t_1_2011.xml"
    },

    indicatorStatic: {
        name: 'primary',
        description: 'This is a description',
        param: [{
            name: 'men',
            type: 'Integer',
            content: 'Number of men in the region'
        },{
            name: 'women',
            type: 'Integer',
            content: 'Number of women in the region'
        }],
        legend: [{
            for: "map",
            item: [{
                min: '0',
                max: '100',
                color: 'yellow',
                content: '0 à 100'
            },{
                min: '101',
                max: '200',
                color: 'red',
                content: '101 à 200'
            }]
        }],
        version: {
            date: '10/20/2012',
            content: '1.0'
        }
    },

    indicatorValue : {
        value: [{
            z: 'z0',
            men: '100',
            women: '200'
        },{
            z: 'z1',
            men: '200',
            women: '100'
        }],
    },

    geometry : {
        zone: [{
            id: 'z0',
            name: 'First zone',
            description: 'Something',
            Polygon: {
                exterior: { posList: '20 30, 30 40, 40 20, ...' },
                interior: [{ posList: '...' }, { posList: '...' }]
            }
        }],
        version: {
            date: '20/10/2012',
            content: '1.0'
        }
    },

    legendPie : {
        values: "men,women",
        for: "pieChart",
        item: [{
            color: "#FFFFFF",
            content: "Hommes"
        },{
            color: "#000000",
            content: "Femmes"
        }]
    }
});

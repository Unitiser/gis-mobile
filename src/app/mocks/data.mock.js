angular.module('gisMobileMocks').constant('MOCKS', {

    structure : {
        category: [{
            id: 'activity_sector',
            label: "Emplois par secteur d'activité",
            indicator: [{
                id: 'primary',
                label: 'Primaire',
                version: "1.0",
                url: "mocks/indicator/primary"
            }, {
                id: 'secondary',
                label: 'Secondaire',
                version: "1.0",
                url: "mocks/indicator/secondary"
            }]
        },{
            id: 'competency_level',
            label: 'Emplois par niveau de compétence',
            indicator: [{
                id: 'something',
                label: 'Else',
                version: "1.0",
                url: "mocks/indicator/something"
            }]
        }],
        geometry: {
            id: "cdq",
            label: "Centre-du-Québec",
            version: "1.0",
            url: 'mocks/geometry'
        }
    },

    indicator: {
        name: 'primary',
        label: 'Primaire',
        description: 'This is a description',
        param: [{
            name: 'men',
            type: 'Integer',
            content: 'Hommes'
        },{
            name: 'women',
            type: 'Integer',
            content: 'Femmes'
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

    indicatorWithElement: {
        name: 'primary',
        label: 'Primaire',
        description: 'This is a description',
        param: [{
            name: 'project',
            type: 'Element',
            param : [{name : 'name', type : 'String', content : 'Nom'},
                     {name : 'value', type : 'Integer', content : 'Valeur'},
                     {name : 'financial', type : 'String', content : 'Financement'},
                     {name : 'note', type : 'Integer', content : 'Note'}]
        }],
        value: [{
            z: '293',
            total: '2',
            project: [{financial: 'FIDA', name: 'projet_17', note: '19', value: '5.0E7'},
                      {financial: 'CI', name: 'projet_20', note: '2', value: '1.5E8'}]
        },{
            z: '294',
            total: '2',
            project: [{financial: 'FIDA', name: 'projet_11', note: '7', value: '3.0E7'},
                      {financial: 'UE', name: 'projet_21', note: '16', value: '2.5E8'}]
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
        url: "mocks/indicator/something"
    },

    indicatorStatic: {
        name: 'primary',
        description: 'This is a description',
        param: [{
            name: 'men',
            type: 'Integer',
            content: 'Hommes'
        },{
            name: 'women',
            type: 'Integer',
            content: 'Femmes'
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
        domainSet: {
            MultiSurface: [{
                id: 'z0',
                name: { content: 'First zone' },
                description: {content: 'Something'},
                Polygon: {
                    exterior: { posList: '20 30, 30 40, 40 20, ...' },
                    interior: [{ posList: '...' }, { posList: '...' }]
                }
            },{
                id: 'z1',
                name: { content: 'Seccond zone' },
                description: { content: 'Something' },
                Polygon: {
                    exterior: { posList: '20 30, 30 40, 40 20, ...' },
                    interior: [{ posList: '...' }, { posList: '...' }]
                }
            }]
        },
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
    },
    legendBar: {
        values: "men,women",
        for: "barChart",
        item: [{
            color: '#FFFFFF',
            content: 'Hommes'
        },{
            color: '#000000',
            content: 'Femmes'
        },{
            min: '200',
            max: '999',
            color: '#FF0000'
        }]
    },
    legendTotal : {
        values: "men,women",
        for: "totalBarChart",
        item: [{
            min: '0',
            max: '100',
            color: '#00FF00',
            content: '0 à 100'
        },{
            min: '101',
            max: '200',
            color: '#FFFF00',
            content: '101 à 200'
        },{
            min: '201',
            max: '999',
            color: '#FF0000',
            content: '201 et plus'
        }]
    },
    legendPieChartBy : {
        by : 'project.financial',
        for : 'pieChartBy',
        value : 'project.value',
        title : 'Montant par bailleur de fond',
        item : [{color : '#ff0000', id : 'Banque Mondial'},
                {color : '#00ff00', id : 'CI'},
                {color : '#0000ff', id : 'FIDA'},
                {color : '#ff00ff', id : 'UE'}]
    },
    alerts: [{
        type: 'totalParam',
        comparator: 'isEqual 300',
        params: ['primary', 'men'],
        resolved: false
    },{
        type: 'zoneParam',
        comparator: 'isBetween 99,101',
        params: ['primary', 'men', 'z0'],
        resolved: false
    }],
    savedAlerts: [{
        type: 'totalParam',
        comparator: 'isEqual 300',
        params: ['primary', 'men'],
        resolved: false,
        _id: 'alert-000000',
        _rev: 'something'
    },{
        type: 'zoneParam',
        comparator: 'isBetween 99,101',
        params: ['primary', 'men', 'z0'],
        resolved: false,
        _id: 'alert-111111',
        _rev: 'something'
    }]
});

angular.module('gisMobile').constant('MOCKS', {

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
            content: 'Hommes'
        },{
            name: 'women',
            type: 'Integer',
            content: 'Femmes'
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

    indicatorWithElement: {
        name: 'primary',
        label: 'Primaire',
        description: 'This is a description',
        param: [{
            name: 'project',
            type: 'Element',
            param : [{name : 'name', type : 'String', content : 'Nom'},
                     {name : 'value', type : 'Integer', content : 'Valeur'},
                     {name : 'financial', type : 'String', content : 'Financement'},
                     {name : 'note', type : 'Integer', content : 'Note'}]
        }],
        value: [{
            z: '293',
            total: '2',
            project: [{financial: 'FIDA', name: 'projet_17', note: '19', value: '5.0E7'},
                      {financial: 'CI', name: 'projet_20', note: '2', value: '1.5E8'}]
        },{
            z: '294',
            total: '2',
            project: [{financial: 'FIDA', name: 'projet_11', note: '7', value: '3.0E7'},
                      {financial: 'UE', name: 'projet_21', note: '16', value: '2.5E8'}]
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
            content: 'Hommes'
        },{
            name: 'women',
            type: 'Integer',
            content: 'Femmes'
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
        domainSet: {
            MultiSurface: [{
                id: 'z0',
                name: { content: 'First zone' },
                description: {content: 'Something'},
                Polygon: {
                    exterior: { posList: '20 30, 30 40, 40 20, ...' },
                    interior: [{ posList: '...' }, { posList: '...' }]
                }
            },{
                id: 'z1',
                name: { content: 'Seccond zone' },
                description: { content: 'Something' },
                Polygon: {
                    exterior: { posList: '20 30, 30 40, 40 20, ...' },
                    interior: [{ posList: '...' }, { posList: '...' }]
                }
            }]
        },
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
    },
    legendBar: {
        values: "men,women",
        for: "barChart",
        item: [{
            color: '#FFFFFF',
            content: 'Hommes'
        },{
            color: '#000000',
            content: 'Femmes'
        },{
            min: '200',
            max: '999',
            color: '#FF0000'
        }]
    },
    legendTotal : {
        values: "men,women",
        for: "totalBarChart",
        item: [{
            min: '0',
            max: '100',
            color: '#00FF00',
            content: '0 à 100'
        },{
            min: '101',
            max: '200',
            color: '#FFFF00',
            content: '101 à 200'
        },{
            min: '201',
            max: '999',
            color: '#FF0000',
            content: '201 et plus'
        }]
    },
    legendPieChartBy : {
        by : 'project.financial',
        for : 'pieChartBy',
        value : 'project.value',
        title : 'Montant par bailleur de fond',
        item : [{color : '#ff0000', id : 'Banque Mondial'},
                {color : '#00ff00', id : 'CI'},
                {color : '#0000ff', id : 'FIDA'},
                {color : '#ff00ff', id : 'UE'}]
    },
    alerts: [{
        type: 'totalParam',
        comparator: 'isEqual 300',
        params: ['primary', 'men'],
        resolved: false
    },{
        type: 'zoneParam',
        comparator: 'isBetween 99,101',
        params: ['primary', 'men', 'z0'],
        resolved: false
    }],
    savedAlerts: [{
        type: 'totalParam',
        comparator: 'isEqual 300',
        params: ['primary', 'men'],
        resolved: false,
        _id: 'alert-000000',
        _rev: 'something'
    },{
        type: 'zoneParam',
        comparator: 'isBetween 99,101',
        params: ['primary', 'men', 'z0'],
        resolved: false,
        _id: 'alert-111111',
        _rev: 'something'
    }]
});
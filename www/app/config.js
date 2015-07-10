angular.module('gisMobile')
//URL to fetch the structure document
.constant('STRUCTURE_URL', 'lib/xmlDocuments/structure.xml')

//Name of the NoSQL database that will be used localy
.constant('LOCAL_DB_NAME', 'gisMobile')

//Known projection systems
.constant('PROJECTIONS', [{
    name: "EPSG:32188",
    definition: "+proj=tmerc +lat_0=0 +lon_0=-73.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
},{
    name: "EPSG:4326",
    definition: "+proj=longlat +datum=WGS84 +no_defs"
}])

//Leaflet projection system
.constant('LEAF_PROJ', "EPSG:4326")

//JSON object to extract data from the structure document
.constant('STRUCTURE_JSON', {
    category : {
        attrs: ['id', 'label'],
        indicator: {
            attrs: ['$isArray', 'id', 'label', 'version', 'url'],
        }
    },
    geometry: {
        attrs: ['id', 'version', 'url']
    }
})

//JSON object to extract data from the indicator document
.constant('INDICATOR_JSON',{
    name: { attrs: ['$content'] },
    description: { attrs: ['$content'] },
    param: {attrs: ['name', 'type', '$content'] },
    marker: {
        attrs: ['srcName'],
        item: { attrs: ['label', '$content'] }
    },
    legend: {
        attrs: ['value', 'values', 'for', 'title', '$isArray'],
        item: { attrs: ['min','max','color','$content'] }
    },
    version: { attrs: ['date', '$content'] }
})

//JSON object to extract data from the geometry document
.constant('GEOMETRY_JSON', {
    domainSet: {
        MultiSurface: {
            attrs: ['id', 'srcName'],
            name: { attrs: ['$content'] },
            description: { attrs: ['$content'] },
            Polygon: {
                exterior: {
                    posList: { attrs: ['$content'] }
                },
                interior: {
                    attrs: ['$isArray'],
                    posList: { attrs: ['$content'] }
                }
            }
        }
    },
    version: {
        attrs: ['date', '$content']
    }
})

//Set logger level
.run(function(){
    Logger.useDefaults();
    Logger.setLevel(Logger.DEBUG);
    Logger.get('Geometry').setLevel(Logger.DEBUG);
});
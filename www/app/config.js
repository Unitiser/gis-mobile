angular.module('gisMobile')
//URL to fetch the structure document
.constant('STRUCTURE_URL', '/lib/xmlDocuments/structure.xml')

//Name of the NoSQL database that will be used localy
.constant('LOCAL_DB_NAME', 'gisMobile')

//JSON object to extract data from the structure document
.constant('STRUCTURE_JSON', {
    category : {
        attrs: ['name', 'label'],
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
    legend: {
        attrs: ['value', 'for'],
        item: { attrs: ['min','max','color','$content'] }
    },
    version: { attrs: ['date', '$content'] }
})

//JSON object to extract data from the geometry document
.constant('GEOMETRY_JSON', {
    domainSet: {
        MultiSurface: {
            attrs: ['id'],
            name: { attrs: ['$content'] },
            description: { attrs: ['$content'] },
            surfaceMembers: {
                Polygon: {
                    exterior: {
                        LinearRing: {
                            posList: { attrs: ['$content'] }
                        }
                    },
                    interior: {
                        LinearRing: {
                            posList: { attrs: ['$content'] }
                        }
                    }
                }
            }
        }
    },
    version: {
        attrs: ['date', '$content']
    }
});
angular.module('gisMobile').service('Indicator', function(xmlparser, $q, localStorage, $rootScope, STRUCTURE_URL, STRUCTURE_JSON, INDICATOR_JSON){
    var indicators = [];

    //Load the categories
    function loadCategories(){
        //Todo check for connection before loading from local storage  
        return localStorage.getStructure()
        .then(function(struct){
            return struct.category;
        })
        .catch(function(e){
            if(e.name != 'not_found') return e;
            
            return xmlparser.readFile(STRUCTURE_URL, STRUCTURE_JSON)
            .then(function(doc){
                localStorage.saveStructure(doc);
                return doc.category;
            });
        });
    }

    //Get categories 
    function getCategories(){
        return loadCategories()
        .then(function(cats){
            categories = [];
            for (var i = cats.length - 1; i >= 0; i--) {
                categories.push({
                    name: cats[i].label,
                    icon: 'ion-map',
                    link: '/cat/indicators/' + cats[i].name,
                });
            };
            return categories;
        });
    }

    //Get indicators by category
    function getIndicators(catId){
        return loadCategories().then(function(cats){
            var cat = _.find(cats, { 'id': catId });
            if(cat) return cat.indicator;
            return $q.reject(catId + " not found");
        });
    }

    //Get indicator by id
    function getIndicatorSummary(id){
        return loadCategories().then(function(cats){
            var indicator = _.find( _.flatten( _.pluck(cats, 'indicator') ), function(ind){ return ind.id == id });

            if(!indicator) return $q.reject(id + ' not found');

            return indicator;
        });
    }

    //Check if indicator version is the same as localStorage
    function validateIndicator(id){
        var localVersion;
        var listVersion;
        return localStorage.getIndicator(id)
        .then(function(local){
            localVersion = local.version.content;
            return getIndicatorSummary(id)
        })
        .then(function(summary){
            listVersion = summary.version;
            return localVersion == listVersion;
        })
        .catch(function(e){
            return false;
        });
    }

    //Load indicator details
    function getIndicator(id){
        return localStorage
        .getIndicator(id)
        .catch(function(e){
            //Indicator was not found, fetch it from http
            var xmlFile;
            var staticPart;
            var summary;
            return getIndicatorSummary(id).then(function(sum){
                summary = sum;
                return xmlparser.loadFile(summary.url);
            })
            .then(function(fileContent){
                //Parse the static part of the file
                xmlFile = fileContent;
                return xmlparser.readXML(xmlFile, INDICATOR_JSON);
            })
            .then(function(staticP){
                //Parse the dynamic part of the file
                staticPart = staticP;
                var dynamicStruct = getDynamicStructure(staticPart);
                return xmlparser.readXML(xmlFile, dynamicStruct);
            })
            .then(function(dynamicP){
                //Merge the 3 parts
                staticPart.value = dynamicP.value;
                staticPart.name = summary.id;
                staticPart.label = summary.label;
                staticPart.url = summary.url;
                staticPart.description = staticPart.description.content;

                //Save it
                localStorage.saveIndicator(staticPart);

                return staticPart;
            });
        });
    }

    //Build the dynamic structure for extration
    function getDynamicStructure(staticPart){
        var params = staticPart.param;
        var dynamicStruct = {
            value: { attrs: ['z'] },
        };

        for (var i = params.length - 1; i >= 0; i--) {
            dynamicStruct.value.attrs.push(params[i].name)
        };

        return dynamicStruct;
    }

    //Return the public api
    return {
        indicators: indicators,
        getCategories: getCategories,
        getIndicator: getIndicator,
        getIndicatorSummary: getIndicatorSummary,
        getIndicators: getIndicators,
        validateIndicator: validateIndicator
    }
});
angular.module('gisMobile').service('Indicator', function(xmlparser, $q, localStorage, $rootScope, Structure, STRUCTURE_URL, STRUCTURE_JSON, INDICATOR_JSON){
    //Get indicator by id
    function getSummary(id){
        return Structure.getCategories()
        .then(function(cats){
            var indicator = _.find( _.flatten( _.pluck(cats, 'indicator') ), function(ind){ return ind.id == id });
            if(!indicator) { return $q.reject(id + ' not found'); }
            return indicator;
        });
    }

    // Load remote version of the indicator
    function getRemote(id){
        var xmlFile;
        var staticPart;
        var summary;

        return getSummary(id)
        .then(function(sum){
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
            return xmlparser.readXML(xmlFile, getDynamicStructure(staticPart));
        })
        .then(function(dynamicPart){
            //Merge the 3 parts
            staticPart.value = dynamicPart.value;
            staticPart.name = summary.id;
            staticPart.label = summary.label;
            staticPart.url = summary.url;
            staticPart.description = staticPart.description.content;

            //Save it
            localStorage.saveIndicator(staticPart);
            return staticPart;
        });
    }

    // Try to load local version of the indicator.
    function getLocal(id){
        return localStorage.getIndicator(id);
    }

    //Check if indicator version is the same as localStorage
    function validate(id){
        var localVersion;
        var listVersion;
        console.log(id);
        return localStorage.getIndicator(id)
        .then(function(local){
            console.log(local);
            localVersion = local.version.content;
            return getSummary(id)
        })
        .then(function(summary){
            console.log(summary);
            listVersion = summary.version;
            return localVersion == listVersion;
        })
        .catch(function(e){
            return false;
        });
    }

    //Check if an indicator is cached
    function isCached(id){
        return localStorage.getIndicator(id)
        .then(function(ind){ return true; })
        .catch(function(e){ return false; });
    }



    //Build the dynamic indicator structure for extration
    function getDynamicStructure(staticPart){
        var params = staticPart.param;
        var dynamicStruct = {
            value: { attrs: ['z'] },
        };

        for (var i = params.length - 1; i >= 0; i--) {

            //Deal with element type params
            if(params[i].type == 'Element'){
                var elementName = params[i].name;
                dynamicStruct.value[elementName] = {};
                dynamicStruct.value[elementName].attrs = [];
                _.forEach(params[i].param, function(param){
                    dynamicStruct.value[elementName].attrs.push(param.name);
                });
                continue;
            }

            dynamicStruct.value.attrs.push(params[i].name)
        };

        return dynamicStruct;
    }

    function flushIndicator(id){
        return localStorage.flushIndicator(id);
    }

    //Return the public api
    return {
        getRemote: getRemote,
        getLocal: getLocal,
        getSummary: getSummary,
        validate: validate,
        flushIndicator: flushIndicator,
        isCached: isCached
    }
});
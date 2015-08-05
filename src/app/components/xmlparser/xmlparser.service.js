/*
*   XML document parser 
*   ----------------------------------------------------------------
*   Description   Use a JavaScript object to extract data from a XML
*                 document.
*   Dependencies  Require angularjs services $q and $http
*   Author        Nicolas Cusson
*   Version       0.0.1
*/


angular.module('gis.xmlparser', []).service('xmlparser', function($q, $http){
    //Load a file and return its content
    function loadFile(file){
        return $q(function(resolve, reject){
            $http.get(file)
            .success(function(res){
                resolve(res);
            })
            .error(function(e){
                console.log(file + ' not found');
                reject(e);
            });
        });
    }

    //Parse xml file, return a dom parser
    function parseFile(file){
        return loadFile(file).then(function(fileContent){
            return parseXML(fileContent);
        });
    }

    //Parse xml string and return a dom parser
    function parseXML(xml){
        var defer = $q.defer();
        var domParser = new DOMParser();
        var result = domParser.parseFromString(xml, 'text/xml');

        //Check for errors
        var hasError = result.getElementsByTagName('parsererror');
        if(hasError.length) defer.reject('INVALID XML');

        defer.resolve(result);

        return defer.promise;
    }

    //Fetch http xmp and construct an object from json structure
    function readFile(file, json){
        var result = {};
        return loadFile(file).then(function(xml){
            return readXML(xml, json);
        });
    }

    //Read xml data directly and extract from json structure
    function readXML(xml, json){
        var result = {};
        return parseXML(xml).then(function(rootNode){
            var name = rootNode.documentElement.tagName;
            parseNode(rootNode, name, json, result);
            return result[name];
        });
    }

    function parseNode(rootNode, name, prop, result){
        var isArray, nodes;

        if(arrayContains(prop.attrs, '$firstGen')) 
            nodes = getChildElementByName(rootNode, name);
        else
            nodes = rootNode.getElementsByTagName(name);

        if(nodes.length > 0)
            result[name] = [];
        
        for(var i = nodes.length - 1; i >= 0; i--){
            var curNode = nodes[i];
            var parsedNode = {};
            
            if(prop.attrs){
                for (var j = prop.attrs.length - 1; j >= 0; j--) {
                    var attr = prop.attrs[j];
                    if(attr == '$content') {
                        parsedNode.content = curNode.textContent;
                        continue;
                    }
                    if(attr == '$isArray') { 
                        isArray = true;
                        continue;
                    }
                    if(curNode.attributes[attr])
                        parsedNode[attr] = curNode.attributes[attr].nodeValue;
                };
            }

            forEachObjectProperty(prop, function(name, prop){
                //Skip non node properties
                if(name == 'callback') return;
                if(name == 'attrs') return;
                parseNode(curNode, name, prop, parsedNode);
            });

            if(!isArray && nodes.length == 1) {
                result[name] = parsedNode; 
                continue;
            }
            result[name].push(parsedNode);
        }
        if(prop['callback']) prop['callback'](parsedNode);
    }

    function getChildElementByName(element, name){
        var childElement = [];

        for (var i = element.childNodes.length - 1; i >= 0; i--) {
            if(element.childNodes[i].tagName == name) childElement.push(element.childNodes[i]);
        };

        return childElement;
    }

    function arrayContains(array, value){
        if(!array) return false
        for (var i = array.length - 1; i >= 0; i--) {
            if(array[i] == value) return true;
        };
    }

    // Iterate over each property of an object
    function forEachObjectProperty(object, cb){
        for (var key in object) {
           if (object.hasOwnProperty(key) && key != 'attrs') {
              cb(key, object[key]);
           }
        }
    }


    return {
        loadFile: loadFile,
        parseFile: parseFile,
        readFile: readFile,
        readXML: readXML
    };
});
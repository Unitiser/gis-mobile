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
    //Load an xml file
    function loadFile(file){
        return $q(function(resolve, reject){
            $http.get(file)
            .success(function(res){
                resolve(res);
            })
            .error(function(e){
                reject(e);
            });
        });
    }

    //Parse xml file
    function parseFile(file){
        return $q(function(resolve, reject){
            loadFile(file).then(function(fileContent){
                var domParser = new DOMParser();
                var result = domParser.parseFromString(fileContent, 'text/xml');

                //Check for errors
                var hasError = result.getElementsByTagName('parsererror');
                if(hasError.length) reject('INVALID XML');
                
                resolve(result);
            },
            function(e){
                reject(e);
            });
        });
    }

    //Construct an object array from json structure
    function readFile(file, json){
        var result = {};
        return $q(function(resolve, reject){
            parseFile(file).then(function(rootNode){
                var name = rootNode.documentElement.tagName;
                parseNode(rootNode, name, json, result);
                resolve(result[name]);
            }, function(e){
                reject(e);
            });
        });
    }

    function parseNode(rootNode, name, prop, result){
        var isArray;
        var nodes = rootNode.getElementsByTagName(name);

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
        readFile: readFile
    };
});
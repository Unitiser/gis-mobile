angular.module('gisMobile').service('xmlparser', function($q, $http){
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
                forEachObjectProperty(json, function(name, prop){
                    parseNode(rootNode, name, prop, result);
                });
                resolve(result);
            }, function(e){
                reject(e);
            });
        });
    }

    function forEachObjectProperty(object, cb){
        for (var key in object) {
           if (object.hasOwnProperty(key) && key != 'attrs') {
              cb(key, object[key]);
           }
        }
    }

    function parseNode(rootNode, name, prop, result){
        if(name == 'attrs') return;
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
                    if(curNode.attributes[attr])
                        parsedNode[attr] = curNode.attributes[attr].nodeValue;
                };
            }

            forEachObjectProperty(prop, function(name, prop){
                parseNode(curNode, name, prop, parsedNode);
            });
            result[name].push(parsedNode);
        }
    }


    //
    return {
        loadFile: loadFile,
        parseFile: parseFile,
        readFile: readFile
    };
});
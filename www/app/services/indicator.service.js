angular.module('gisMobile').service('Indicator', function(xmlparser, $q){
    var indicators = [];
    var categoriesDoc = false;
    var apiUrl = '/lib/xmlDocuments/indicator.xml';

    //Load the categories
    function loadCategories(){
        var structure = {
            category : {
                attrs: ['name', 'label'],
                indicator: {
                    name: { attrs: ['$content'] },
                    label: { attrs: ['$content'] },
                    version: { attrs: ['$content'] },
                    url: { attrs: ['$content'] }
                }
            }
        }
        return $q(function(resolve, reject){
            if(categoriesDoc) return resolve(categoriesDoc.category);
            xmlparser.readFile(apiUrl, structure)
            .then(function(doc){
                categoriesDoc = doc;
                resolve(doc.category)
            })
            .catch(function(e){
                reject(e);
            });
        });
    }

    //Get categories 
    function getCategories(){
        return $q(function(resolve, reject){
            loadCategories()
            .then(function(cats){
                categories = [];
                for (var i = cats.length - 1; i >= 0; i--) {
                    categories.push({
                        name: cats[i].label,
                        icon: 'ion-map',
                        link: '/cat/indicators/' + cats[i].name,
                        url: cats[i].url
                    });
                };
                resolve(categories);
            })
            .catch(function(e){
                reject(e);
            });
        });
    }

    //Get indicators by category
    function getIndicators(catName){
        var deferred = $q.defer();

        loadCategories().then(function(cats){
            var cat = _.find(cats, { 'name': catName });
            if(cat) return deferred.resolve(cat.indicator);
            deferred.reject(catName + " not found");
        })
        .catch(function(e){
            deferred.reject(e);
        });

        return deferred.promise;
    }

    //Get indicator by name
    function getIndicator(name){
        var deferred = $q.defer();

        loadCategories().then(function(cats){
            var indicator = _.find(_.flatten(_.pluck(cats, 'indicator')), function(ind){ return ind.name.content == name });
            var result = {};
            if(!indicator) return deferred.reject(name + ' not found');
            
            _.forOwn(indicator, function(value, key){
                result[key] = value.content;
            });

            deferred.resolve(result);
        })
        .catch(function(e){
            deferred.reject(e);
        });

        return deferred.promise;
    }

    //Validate indicator version with localstorage

    //Load indicator details

    return {
        indicators: indicators,
        getCategories: getCategories,
        getIndicator: getIndicator,
        getIndicators: getIndicators,
        tryLoadCats: loadCategories
    }
});
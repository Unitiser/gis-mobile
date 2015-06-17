angular.module('gisMobile').service('Indicator', function(xmlparser, $q){
    var indicators = [];

    //Load the categories
    function loadCategories(url){
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
            xmlparser.readFile(url, structure)
            .then(function(cats){
                resolve(cats)
            })
            .catch(function(e){
                reject(e);
            });
        })
    }

    //Get categories 
    function getCategories(url){
        return $q(function(resolve, reject){
            loadCategories(url)
            .then(function(doc){
                var cats = doc.category;
                var categories = [];
                for (var i = cats.length - 1; i >= 0; i--) {
                    categories.push({
                        name: cats[i].label,
                        icon: 'ion-map',
                        link: '/cat/indicators/' + cats[i].name
                    });
                };
                resolve(categories);
            })
            .catch(function(e){
                reject(e);
            });
        });
    }

    //Fetch categories from url
    function fetchCategories(){

    }

    //Get indicators by category
    //Get indicator

    return {
        indicators: indicators,
        getCategories: getCategories,
        getIndicator: function(id){
            return _.find(indicators, {id: id});
        },
        tryLoadCats: loadCategories
    }
});
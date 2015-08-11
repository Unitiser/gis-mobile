angular.module('gisMobile').service('Alert',function(Indicator, Structure, $q, localStorage){

    //List all alerts
    function list(){
        return localStorage.listAlerts();
    }

    //Save an alert
    function save(alert){
        return localStorage.saveAlert(alert.serialize());
    }

    //Remove an alert
    function remove(alert){
        return localStorage.removeAlert(alert.id);
    }

    //Functions used to extend Alert by type.
    var alertType = {
        zoneParam: function(comparator, indId, param, catId, zone){ 
            var ctx = this;
            this.isThrown = function(){
                return ctx.isDismissed ? $q.when(false) : Indicator.getLocal(indId)
                        .then(function(ind){ 
                            return ind.version.content == ctx.resolved ? false : comparator(parseInt(_.find(ind.value, {z: zone})[param])); 
                        });
            }

            this.toString = function(){
                var stringFormat = "La valeur de %s1 de %s5 de la zone %s6 %s2 %s3. La nouvelle valeur de %s1 est %s4.";
                var cat;
                return Structure.getLocal()
                .then(function(struct){ 
                    cat = _.find(struct.category, {id : catId}); 
                    return Indicator.getLocal(indId)
                })
                .then(function(indicator){
                    return stringFormat.replace(/%s1/g, param)
                    .replace(/%s2/g, comparatorString[comparator.toString().split(' ')[0]])
                    .replace(/%s3/g, comparator.toString().split(' ')[1])
                    .replace(/%s4/g, _.find(indicator.value, {z: zone})[param])
                    .replace(/%s5/g, indicator.label)
                    .replace(/%s6/g, zone);
                });
            }
        },
        totalParam: function(comparator, indId, param, catId){
            var ctx = this;
            this.isThrown = function(){
                return ctx.isDismissed ? $q.when(false) : Indicator.getLocal(indId)
                        .then(function(ind){ 
                            return ind.version.content == ctx.resolved ? false : comparator(_.sum(ind.value, param)); 
                        });
            }

            this.toString = function(){
                var stringFormat = "La somme de %s1 de %s5 %s2 %s3. La nouvelle somme de %s1 est %s4.";
                var cat;
                return Structure.getLocal()
                .then(function(struct){ 
                    cat = _.find(struct.category, {id : catId}); 
                    return Indicator.getLocal(indId)
                })
                .then(function(indicator){
                    return stringFormat.replace(/%s1/g, param)
                    .replace(/%s2/g, comparatorString[comparator.toString().split(' ')[0]])
                    .replace(/%s3/g, comparator.toString().split(' ')[1])
                    .replace(/%s4/g, _.sum(indicator.value, param))
                    .replace(/%s5/g, cat.label + ' ' + indicator.label);
                });
            }
        }
    }

    function Alert(type, comparator){
        //Slice type and comparator
        var args = Array.prototype.slice.call(arguments, 2);
        
        //retrieve rev and id
        this.rev = args.pop();
        this.id = args.pop();
        this.resolved = args.pop();

        //Turn comparator string into an object
        if(typeof comparator === 'string'){ comparator = getComparator(comparator); }
        
        //the args become the params
        var params = args;

        //Dismiss an alert
        this.dismiss = function(){
            this.isDismissed = true;
        }

        //Resolve an alert
        this.resolve = function(version){
            this.resolved = version;
            save(this);
        }

        //Serialize function to object
        this.serialize = function(){
            return {
                type: type,
                comparator: comparator.toString(),
                params: params,
                resolved: this.resolved,
                _id: this.id,
                _rev: this.rev
            }
        }

        //Extend Alert with param type
        alertType[type].apply(this, [comparator].concat(args)); 
    }

    //Conditions
    var comparators = {
        isEqual : function isEqual(value, x){ return value == x; },
        isSmaller : function isSmaller(value, x){ return value < x; },
        isGreater : function isGreater(value, x){ return value > x; },
        isBetween : function isBetween(value, x, y){ return value >= x && value <= y; }
    };

    var comparatorString = {
        isEqual : 'est égal à',
        isGreater : 'est plus grande que',
        isSmaller : 'est plus petite que',
        isBetween : 'est entre'
    };

    function getComparator(type){
        var args;
        //Parse arguments
        if(arguments.length > 1){
            args = Array.prototype.slice.call(arguments,1);
        }else{
            var params = type.split(" ");
            type = params[0];
            args = params[1].split(',');
        }
        
        var comparator = function(value){
            return comparators[type].apply(this, [value].concat(args));
        };

        comparator.toString = function(){
                return type + " " + args;
        };

        return comparator;
    }

    return {
        getComparator: getComparator,
        create: function(){
            var args = Array.prototype.slice.apply(arguments);
            
            //If we have only 1 object, it means were rebuilding from save
            if(args.length == 1){ 
                var obj = args[0];
                args = [obj.type, obj.comparator].concat(obj.params).concat([obj.resolved, obj._id, obj._rev]);
            }
            
            //Otherwise, were using the normal api, so we must specify that rev and id are undefined
            else { args = args.concat([false, undefined, undefined]); }

            var alert = new (Function.prototype.bind.apply(Alert, [null].concat(args)));
            
            //If alert is new, save it in localStorage
            if(!alert.id) save(alert);

            return alert;
        },
        list: list,
        remove: remove
    }
});
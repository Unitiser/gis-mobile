angular.module('gisMobile').service('Geometry', function(localStorage, xmlparser){
    //Source proj
    proj4.defs("EPSG:32188","+proj=tmerc +lat_0=0 +lon_0=-73.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
    //Destination proj
    proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs ");

    //Load geometry
    //Get geometry
    //Change projection
    //Validate version
});
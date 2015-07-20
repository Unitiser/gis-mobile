# gis-mobile
Generic mobile client used to visualize indicator.

# Requirement
The app is built with Node.js using the Ionic framework for hybrid application. The project also makes an extansive use of Gulp to customise the build process. Make sure Nodejs is availlable.

Install ionic
```
npm install -g ionic
```

Install gulp
```
npm install -g gulp
```

# Before launching

Download bower and npm dependencies
```
npm install
bower update
```

Add the desired platform
```
ionic platform add android
```

# Method used for the build
The gulp process are hooked into Ionic and cordova. When using "ionic run" and "ionic serve", the app is configured to launch "gulp dev" and "gulp prod". Those tasks are used to rebuild the "www/" with the ressources we need.
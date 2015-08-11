// Karma configuration
// Generated on Mon Jun 15 2015 11:23:49 GMT-0400 (EDT)
var mainBowerFiles = require('main-bower-files');
var _ = require('lodash');
var fs = require('fs');

module.exports = function(config) {
  //Get bower dependencies
  var bower = [];
  _.forEach(mainBowerFiles('**/*.js', { includeDev: true }), function(path){ bower.push(path.replace(__dirname + '/src/', '')); });
  bower.push('lib/ngCordova/dist/ng-cordova-mocks.js');

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: 'src/',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    // files: [
    //   {pattern: '*/*.spec.js'}
    // ],

    files: bower.concat([
      'app/mocks/*.mock.js',
      'app/config.js',
      { pattern: 'app/components/**/*.service.js' },
      { pattern: 'app/services/*.service.js' },
      { pattern: 'app/**/*.spec.js' }
    ])
    ,
    // list of files to exclude
    exclude: [
    'app/services/auth.service.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};

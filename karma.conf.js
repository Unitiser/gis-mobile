// Karma configuration
// Generated on Mon Jun 15 2015 11:23:49 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: 'www/',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    // files: [
    //   {pattern: '*/*.spec.js'}
    // ],

    files: [
      'lib/angular/angular.js',
      // 'lib/angular-animate/angular-animate.js',
      // 'lib/angular-sanitize/angular-sanitize.js',
      'lib/angular-mocks/angular-mocks.js',
      // 'lib/angular-ui-router/angular-ui-router.js',
      // 'lib/ionic/js/ionic.js',
      // 'lib/ionic/js/ionic-angular.js',
      // 'lib/data.xml',
      'app/app.mock.js',
      'app/services/xmlparser.service.js',
      // {pattern: 'app/services/xmlparser.service.js'},
      {pattern: 'app/**/*.spec.js'},
      {pattern: 'lib/xmlDocuments/*.xml', included: false, served: true}
      // 'app/main-test.js'
    ],
    // list of files to exclude
    exclude: [
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

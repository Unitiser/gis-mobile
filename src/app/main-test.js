var allTestFiles = [];
var TEST_REGEXP = /spec\.js$/;

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(file);
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base/app/',

  // example of using a couple path translations (paths), to allow us to refer to different library dependencies, without using relative paths
  paths: {
    'angular': '../lib/angular/angular.min',
    'xmlparser' : 'services/xmlparser.service'
  },

  // example of using a shim, to load non AMD libraries (such as underscore)
  shim: {
    'angular': {
      exports: 'angular'
    },
    // 'app': {
    //   exports: 'app'
    // }
  },

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
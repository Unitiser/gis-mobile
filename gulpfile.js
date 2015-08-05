var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var rename = require('gulp-rename');
var sh = require('shelljs');
var karma = require('karma').server;

//Tools to inject the scripts
var wiredep = require('wiredep').stream;
var inject = require('gulp-inject');
var preprocess = require('gulp-preprocess');

//Tools to bundle the app
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');
var mainBowerFiles = require('main-bower-files');
var gulpFilter = require('gulp-filter');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var del = require('del');

var paths = {
  sass: ['./src/assets/scss/**/*.scss'],
  js: ['./src/app/**/*.js',
       '!./src/app/**/*.spec.js', 
       '!./src/app/main-test.js',
       '!./src/app/mocks/*'],
  css: ["css/ionic.app.css",
        "css/style.css"]
};

gulp.task('default', ['sass', 'inject', 'wiredep']);

gulp.task('sass', function(done) {
  gulp.src('./src/assets/scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true,
      relative_assets: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['fetch']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

//Inject bower in ./www/index.html 
gulp.task('wiredep', function(done){
  gulp.src('./src/index.html')
    .pipe(wiredep({
      exclude: [ 'lib/ionic/css/ionic.css', 'lib/ngCordova/dist/ng-cordova.js' ]
    }))
    .pipe(gulp.dest('./www/'))
    .on('end', done);
});

// Inject scripts in index.html
gulp.task('injectJS', ['fetchJS', 'wiredep'], function(done){
  var target = gulp.src('./www/index.html');
  var sources = gulp.src(['./src/lib/ngCordova/dist/ng-cordova-mocks.js']
                          .concat(paths.js), {read: false });

  target.pipe(inject(sources, {addRootSlash: false, ignorePath: 'src/'}))
    .pipe(gulp.dest('./www/'))
    .on('end', done);
});
gulp.task('injectCSS', ['fetchCSS', 'wiredep'],function(){
    var target = gulp.src('./www/index.html');
    var sources = gulp.src(paths.css, {read: false, cwd: './www/' });
    target.pipe(inject(sources, {addRootSlash: false }))
      .pipe(gulp.dest('./www/'))
})

// Copy file into www/
gulp.task('fetchBower', function(){
  gulp.src(mainBowerFiles().concat('./src/lib/ngCordova/dist/ng-cordova-mocks.js'), { base: './src/lib/' })
  .pipe(gulp.dest('./www/lib/'));
});

gulp.task('fetchJS', ['fetchBower'],function(){
  gulp.src(paths.js.concat(['!./src/app/app.js']))
    .pipe(gulp.dest('./www/app/'))
});

gulp.task('fetchCSS', ['sass'],function(){
  gulp.src(mainBowerFiles({filter : '**/*.css'}))
  .pipe(gulp.dest('./www/css'));
});

gulp.task('fetchHTML', function(){
  gulp.src('./src/app/**/*.html')
  .pipe(gulp.dest('./www/app/'));
});

gulp.task('fetchAssets', function(){
  gulp.src(['./src/assets/**/*', '!./src/assets/scss', '!./src/assets/scss/**/*'])
  .pipe(gulp.dest('./www/assets'));
});

gulp.task('fetchLibFonts', function(){
  gulp.src(mainBowerFiles({filter : ['**/*.woff', '**/*.ttf']}), { base: './src/lib/' })
    .pipe(gulp.dest('./www/lib'));
});

gulp.task('fetchLibImg', function(){
  gulp.src(mainBowerFiles({filter : ['**/*.png']}))
    .pipe(gulp.dest('./www/img'));
});

gulp.task('fetch', ['fetchJS', 'fetchBower', 'fetchCSS', 'fetchHTML', 'fetchAssets']);

gulp.task('removeWWW', function(done){
  del(['www'], done);
});

gulp.task('inject', ['injectJS', 'injectCSS']);

gulp.task('dev', ['removeWWW'], function(done){
  gulp.src('./src/app/app.js')
  .pipe(preprocess({context: { NODE_ENV: 'development' }}))
  .pipe(gulp.dest('./www/app/'));

  gulp.start(['inject', 'fetch'])
  .on('end', done);
});


gulp.task('prod', ['removeWWW'], function(done) {
  //Use the prepared app.js
  paths.js.push('!./src/app/app.js');
  paths.js.unshift('./www/app.js');

  gulp.src('./src/app/app.js')
    .pipe(preprocess({context: { NODE_ENV: 'production' }}))
    .pipe(gulp.dest('./www/'))
    .on('end', function(){
      gulp.start(['bundle', 'fetchHTML', 'fetchAssets', 'fetchLibFonts', 'fetchLibImg','injectBundle'])
      .on('end', done);
    });
});

//Bundle the application in a single page app
gulp.task('bundleJs', function(done){
  gulp.src(mainBowerFiles().concat(paths.js))
    .pipe(gulpFilter('**/*.js'))
    // .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./www/'))
    .on('end', done);
});

//Avoid uglify and ngAnnotate, theyre way to slow ...
gulp.task('softBundleJS', function(done){
  gulp.src(mainBowerFiles({filter : '**/*.js'}).concat(paths.js))
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./www/'))
    .on('end', done);
});

gulp.task('bundleCss', ['sass'], function(done){
  var cssFile = ["./www/css/ionic.app.css",
                 "./www/css/style.css"];

  gulp.src(mainBowerFiles().concat(cssFile))
    .pipe(gulpFilter('**/*.css'))
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('./www/css'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css'))
    .on('end', done);;
});

gulp.task('bundle', ['softBundleJS', 'bundleCss']);

gulp.task('injectBundle',['softBundleJS', 'bundleCss'], function(){
  var bundle = ['./www/bundle.js',
                './www/css/bundle.min.css'];
  var target = gulp.src('./src/index.html');
  var sources = gulp.src(bundle, {read: false });
  target.pipe(inject(sources, {addRootSlash: false, ignorePath: 'www/' }))
      .pipe(gulp.dest('./www/'))
});

//Run karma tests
gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, function() {
        done();
    });
});

gulp.task('envDev', function(done){
  gulp.src()
    .pipe(preprocess())
    .pipe(gulp.dest());
});

gulp.task('envProd');

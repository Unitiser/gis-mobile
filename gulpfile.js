var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var rename = require('gulp-rename');
var sh = require('shelljs');
var karma = require('karma').server;

//Tools to inject the scripts
var wiredep = require('wiredep').stream;
var inject = require('gulp-inject');

//Tools to bundle the app
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');
var mainBowerFiles = require('main-bower-files');
var gulpFilter = require('gulp-filter');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass', 'inject', 'wiredep']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
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

// Inject script in index.html
gulp.task('wiredep', function(){
  gulp.src('./www/index.html')
    .pipe(wiredep({
      exclude: [ 'lib/ionic/css/ionic.css' ]
    }))
    .pipe(gulp.dest('./www/'));
});

gulp.task('inject', function(){
  var target = gulp.src('./www/index.html');
  var jsFiles = ['app/**/*.js', 
               '!app/**/*.spec.js', 
               '!app/main-test.js',
               '!app/mocks/*'];
  var cssFile = ["css/ionic.app.css",
                 "css/style.css"];
  var sources = gulp.src(jsFiles.concat(cssFile), {read: false, cwd: './www/'});
 
  return target.pipe(inject(sources))
    .pipe(gulp.dest('./www/'));
});

gulp.task('bundleJs', function(done){
  var jsFiles = ['./www/app/**/*.js', 
                 '!./www/app/**/*.spec.js', 
                 '!./www/app/main-test.js',
                 '!./www/app/mocks/*'];

  gulp.src(mainBowerFiles().concat(jsFiles))
    .pipe(gulpFilter('**/*.js'))
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./www/'))
    .on('end', done);
});

gulp.task('bundleCss', ['sass'], function(done){
  var cssFile = ["./www/css/ionic.app.css",
                 "./www/css/style.css"];

  gulp.src(mainBowerFiles().concat(cssFile))
    .pipe(gulpFilter('**/*.css'))
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('./www/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/'))
    .on('end', done);;
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

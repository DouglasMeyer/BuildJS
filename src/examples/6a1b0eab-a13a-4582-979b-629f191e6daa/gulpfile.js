
// - Requires
var gulp = require('gulp'),
    clean = require('gulp-clean'),
    jade = require('gulp-jade'),
    //browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    scss = require('gulp-sass'),
    refresh = require('gulp-livereload'),
    lrServer = require('tiny-lr')(),
    minifyCSS = require('gulp-minify-css'),
    embedlr = require('gulp-embedlr');


// - Constants
var srcDir = 'src/',
    jadeGlob = '**/*.jade',
    scssGlob = '**/*.scss',
    jsGlob = '**/*.js',
    jadeFiles = [ srcDir+jadeGlob ],
    scssFiles = [ srcDir+scssGlob ],
    jsFiles   = [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-animate/angular-animate.js',
      srcDir+'index.js', // Ensure our app is between angular and the rest.
      srcDir+jsGlob
    ],
    buildDir = '../../../',
    lrPort = 35729;


// - Steps
gulp.task('clean', function(){
  gulp.src([
        buildDir+'*',
    '!'+buildDir+'src',
    '!'+buildDir+'package.json',
    '!'+buildDir+'Readme.md',
    '!'+buildDir+'site'
  ], { read: false })
    .pipe(clean({ force: true }));
});

gulp.task('html', function() {
  gulp.src(jadeFiles)
      .pipe(jade({}))
      .pipe(embedlr({
        src: 'http://localhost:' + lrPort + '/livereload.js?snipver=1'
      }))
      .pipe(gulp.dest(buildDir))
      .pipe(refresh(lrServer));
});

gulp.task('css', function() {
  gulp.src(scssFiles)
      .pipe(scss())
      .pipe(minifyCSS())
      .pipe(concat('index.css'))
      .pipe(gulp.dest(buildDir))
      .pipe(refresh(lrServer))
});

gulp.task('js', function() {
  gulp.src(jsFiles)
      .pipe(concat('index.js'))
      .pipe(gulp.dest(buildDir))
      .pipe(refresh(lrServer))
});

gulp.task('server', function(next) {
  var connect = require('connect'),
      historyApiFallback = require('connect-history-api-fallback');
  connect()
    .use(function(req, res, next){
      req.url = req.url.replace('/BuildJS', '/');
      next();
    })
    .use(historyApiFallback)
    .use(connect.static(buildDir))
    .listen(process.env.PORT || 8000, next);
});

gulp.task('lr-server', function() {
  lrServer.listen(lrPort, function(err) {
    if(err) return console.log(err);
  });
});


// - Tasks
gulp.task('default', ['clean', 'server', 'lr-server'], function() {
  gulp.start('html', 'css', 'js');

  gulp.watch(jsFiles,   ['js']  );
  gulp.watch(scssFiles, ['css'] );
  gulp.watch(jadeFiles, ['html']);
});

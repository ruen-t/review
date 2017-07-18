var gulp = require('gulp');
var sass = require('gulp-sass');
var inject = require('gulp-inject');
var browserSync = require('browser-sync').create();
var wiredep = require('wiredep').stream;
var base = "/src/"
var gulpFilter = require('gulp-filter');
var bowerSrc = require('gulp-bower-src');
var uglify = require('gulp-uglify');
require('require-dir')('./gulp');
var filter = gulpFilter('**/*.js', '!**/*.min.js');

gulp.task('bundle', function () {
    bowerSrc().pipe(gulp.dest('dist/lib'));
});
gulp.task('sass', function(){
    return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});
gulp.task('inject', function () {
  var target = gulp.src('app/src/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths: 
  var sources = gulp.src(['./app/**/*.js', './app/**/*.css'], {read: false});
 
  return target.pipe(inject(sources,{relative: true, addRootSlash: false}))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', function (){
  gulp.watch(['app/js/**/*.js','app/src/*.html','app/scss/**/*.scss','app/css/**/*.css'], ['reload','deploy']);
  // Other watchers
});

gulp.task('injectall', function () {
  var target = gulp.src('app/src/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths: 
  var sources = gulp.src(['./app/**/*.js', './app/**/*.css'], {read: false});
 
  return target.pipe(wiredep({
      optional: 'configuration',
      ignorePath: '../../'
    }))
.pipe(inject(sources,{relative: false, addRootSlash: false}))
.pipe(gulp.dest('./'));
  

});
gulp.task('reload',['injectall'],function(){
  return gulp.src('app/js/*.js').pipe(browserSync.reload({
      stream: true
    }))
})
gulp.task('bowerInject', function () {
  gulp.src('app/src/index.html')
    .pipe(wiredep({
      optional: 'configuration',
 ignorePath: '../../'
    }))
    .pipe(gulp.dest('./'));
});
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: ''
    },
  })
})
var BatchStream = require('batch-stream2')
var gulp = require('gulp')
var coffee = require('gulp-coffee')
var uglify = require('gulp-uglify')
var cssmin = require('gulp-minify-css')
var bower = require('gulp-bower-files')
var stylus = require('gulp-stylus')
var livereload = require('gulp-livereload')
var include = require('gulp-include')
var concat = require('gulp-concat')
var browserify = require('gulp-browserify')
var gulpFilter = require('gulp-filter')
var watch = require('gulp-watch')
const imagemin = require('gulp-imagemin');
var jsonminify = require('gulp-jsonminify');
var rename = require('gulp-rename')
var mainBowerFiles = require('main-bower-files');
var htmlmin = require('gulp-htmlmin');
var inject = require('gulp-inject');
var shell = require('gulp-shell')
var src = {
  styl: ['app/**/*.styl'],
  css: ['app/**/*.css'],
  coffee: ['app/**/*.coffee'],
  js: ['app/**/*.js'],
  html: ['app/src/*.html','!app/src/index.html'],
  bower: ['bower.json', '.bowerrc']
}
src.styles = src.styl.concat(src.css)
src.scripts = src.coffee.concat(src.js)
gulp.task("bowerfiles", function(){
  var jsFilter = gulpFilter('**/*.js')
  var cssFilter = gulpFilter('**/*.css')
    bower()
    .pipe(jsFilter)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest("dist"));
});
var publishdir = 'dist'
var dist = {
  all: [publishdir + '/**/*'],
  css: publishdir + '/lib/',
  js: publishdir + '/lib/',
  vendor: publishdir + '/lib/',
  html: publishdir + '/app/src/'
}

//
// concat *.js to `vendor.js`
// and *.css to `vendor.css`
// rename fonts to `fonts/*.*`
//
var minifyCssOptions = {
        inliner: {
            request: {
                  hostname: "http://172.16.252.110",   // I'm running a cntlm proxy which relays to the corp proxy
                  port: 3128,
                  path: "http://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,400,700",
                  headers: {
                    Host: "fonts.googleapis.com"
                  }
            }
        }
};
gulp.task('bower', function() {
  var jsFilter = gulpFilter('**/*.js')
  var cssFilter = gulpFilter('**/*.css')
   bower()
    .pipe(jsFilter)
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dist.js))
    //.pipe(jsFilter.restore())
    bower().pipe(cssFilter)
    .pipe(concat('vendor.css'))
    .pipe(cssmin(minifyCssOptions))
    .pipe(gulp.dest(dist.css))
    //.pipe(cssFilter.restore())
    /* bower().pipe(rename(function(path) {
      if (~path.dirname.indexOf('fonts')) {
        path.dirname = '/fonts'
      }
    }))
    .pipe(gulp.dest(dist.vendor))*/
})

function buildCSS() {
  return gulp.src(src.styles)
    .pipe(stylus({use: ['nib']}))
    .pipe(concat('app.css'))

    .pipe(gulp.dest(dist.css))
}

function buildJS() {
  return gulp.src(src.scripts)
    /*.pipe(include())
    //.pipe(coffee())
    .pipe(browserify({
      insertGlobals: true,
      //extensions: ['.coffee'],
      debug: true
    }))*/
    .pipe(concat('app.js'))
    //.pipe(uglify())
    .pipe(gulp.dest(dist.js))
}

gulp.task('css', buildCSS)
gulp.task('js', buildJS)
/*
gulp.task('watch', function() {
  gulp.watch(src.bower, ['bower'])
  watch({ glob: src.styles, name: 'app.css' }, buildCSS)
  watch({ glob: src.scripts, name: 'app.js' }, buildJS)
})
//
// live reload can emit changes only when at lease one build is done
//
gulp.task('livereload', ['bower', 'css', 'js', 'watch'], function() {
  var server = livereload()
  var batch = new BatchStream({ timeout: 100 })
  gulp.watch(dist.all).on('change', function change(file) {
    // clear directories
    var urlpath = file.path.replace(__dirname + '/' + publishdir, '')
    // also clear the tailing index.html
    urlpath = urlpath.replace('/index.html', '/')
    batch.write(urlpath)
  })
  batch.on('data', function(files) {
    server.changed(files.join(','))
  })
})*/

gulp.task('scp', shell.task([
  
  'scp -r dist/* pt-reviewtool-vmg.wni.co.jp:/usr/local/www/apache24/data/easyreviewDev'
]))
gulp.task('injectbuild', function () {
  
   var target = gulp.src('app/src/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths: 
  var sources = gulp.src(['./dist/lib/vendor.js','./dist/lib/app.js','./dist/lib/vendor.css','./dist/lib/app.css'], {read: false});
   target
   .pipe(inject(sources, {relative: false, addRootSlash: false,ignorePath: 'dist',name:"build"}))
   .pipe(htmlmin({collapseWhitespace: true}))
   .pipe(gulp.dest(publishdir));
  
});

gulp.task('minifyhtml', function() {
  return gulp.src(src.html)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(dist.html));
});
gulp.task('minifyJSON', function () {
    return gulp.src(['./assets/*.json'])
        .pipe(jsonminify())
        .pipe(gulp.dest('dist/assets'));
});
gulp.task('compress-css', ['css'], function() {
  /*return gulp.src(dist.css+"app.css")
    .pipe(cssmin())
    .pipe(gulp.dest(dist.vendor))*/
})
gulp.task('minifyIMG',['favicon'],function(){
  return gulp.src(['./assets/*.gif','./assets/*.jpg','./assets/*.png'])
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets'))
})
gulp.task('favicon',function(){
  return gulp.src(['./assets/icon_fav/*'])
        .pipe(gulp.dest('dist/assets/icon_fav'))
})
gulp.task('compress-js', ['js'], function() {
  /*return gulp.src(dist.js+"vendor.js")
    .pipe(uglify())
    .pipe(gulp.dest(dist.vendor+"vendor.min.js"))*/
})
gulp.task('compress', ['compress-css', 'compress-js'])

gulp.task('default', ['bower', 'css', 'js', 'livereload']) // development
gulp.task('build', ['bower', 'compress','minifyhtml','minifyJSON','minifyIMG','injectbuild']) // build for production
gulp.task('deploy', ['build'], shell.task([
  
  'scp -r dist/* pt-reviewtool-vmg.wni.co.jp:/usr/local/www/apache24/data/easyreviewDev'
]))
gulp.task('production', ['build'], shell.task([
  
  'scp -r dist/* pt-reviewtool-vmg.wni.co.jp:/usr/local/www/apache24/data/easyreview'
]))
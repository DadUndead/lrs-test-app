/**
 * Created by aklimenko on 22.04.16.
 */
'use strict';

//Default plugins---------------------------
var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var watch = require('gulp-watch');

//Common plugins----------------------------
var runSequence = require('run-sequence');    //запуск задач в нужном порядке (в каждой задаче нужен return)
var concat = require('gulp-concat');          //сборка файлов в один
var del = require('del');                     //удаление файлов
var rename = require('gulp-rename');          //переименование файлов
var ignore = require('gulp-ignore');          //исключение файлов из потока (stream)
var addsrc = require('gulp-add-src');          //добавление файлов в поток (stream)
var logger = require('gulp-logger');          //логгирование процессов
var gfi = require("gulp-file-insert");        //вставка файла по флагу в другом файле /* флаг */
var rigger = require('gulp-rigger');          //сбока файлов, подключенные методом "//= имя файла"
//var inject = require('gulp-inject');          //вставка либ в html (например)

//JS----------------------------------------
var minify = require('gulp-minify');          //минификация js

//Typescript
//var tsc = require('gulp-tsc');                //компиляция typescript

//Modernizr--------------------------------
var modernizr = require('gulp-modernizr');
//CSS--------------------------------------
var concatCss = require('gulp-concat-css');
var prefixer = require('gulp-autoprefixer'); //расставляет префиксы для css под разные браузеры
var sass = require('gulp-sass');             //работа с sass (ruby)
var compass = require('gulp-compass');       //компилирует scss
var cssnano = require('gulp-cssnano');       //минификация css
var stripCssComments = require('gulp-strip-css-comments');       //удаляет комментарии в css

var sourcemaps = require('gulp-sourcemaps'); //TODO: разобраться что это такое

//IMG-----------------------------------------
var imagemin = require('gulp-imagemin');     //сжатие изображений
var pngquant = require('imagemin-pngquant'); //TODO: разобраться что это такое

//SCORM=======================================
var manifest = require('gulp-scorm-manifest');
//var zip = require('gulp-zip');

var templateCache = require('gulp-angular-templatecache'); //puts angular templates to $templatecahce

module.exports = function (options, current_module, pathCfg) {

//Cleaners ======================================================
  /**
   * Full clear build module
   */
  gulp.task('clean-all', function (callback) {
    if (!options.images) {
      gutil.log('No images')
      runSequence(
        'clean-js',
        'clean-styles',
        'clean-html',
        'clean-assets',
        'clean-fonts',
        'clean-pages',
        'clean-templates',
        callback);
    } else {
      return del([current_module.build + '**'], {force: true});
    }
  });

  gulp.task('clean-js', function () {
    return del([pathCfg.build.js + '**'], {force: true});
  });

  gulp.task('clean-styles', function () {
    return del([pathCfg.build.css + '**'], {force: true});
  });

  gulp.task('clean-html', function () {
    return del([pathCfg.build.html + 'index.html'], {force: true});
  });

  gulp.task('clean-templates', function () {
    return del([pathCfg.build.templates + '**'], {force: true});
  });

  gulp.task('clean-img', function () {
    return del([pathCfg.build.img + '**'], {force: true});
  });

  gulp.task('clean-assets', function () {
    return del([pathCfg.build.assets + '**'], {force: true});
  });

  gulp.task('clean-fonts', function () {
    return del([pathCfg.build.fonts + '**'], {force: true});
  });

  gulp.task('clean-pages', function () {
    return del([pathCfg.build.pages + '**'], {force: true});
  });


//Builders ======================================================
  /**
   * Сбор html 'gulp html:build'
   */
  gulp.task('html:build', ['clean-html'], function () {
    return gulp.src(pathCfg.src.html)
      .pipe(watch(pathCfg.src.html))
      .pipe(logger({
        before: 'Mr Rigger is concating js files into one...',
      }))
      .pipe(rigger())

      .pipe(logger({
        before: 'Mr Gulp is deploying file...',
      }))
      .pipe(gulp.dest(pathCfg.build.html))
      .pipe(gulp.start('webserver:reload'))
  });

  /**
   * Сбор шаблонов для директив angular templates 'gulp templates:build'
   */
  gulp.task('templates:build', ['clean-templates'], function (cb) {
    //var options = {
    //  output: 'templates.js',
    //  strip: '',
    //  prepend: 'templates',
    //  // angular module name
    //  moduleName: 'templates',
    //  minify: {}
    //};

    gulp.src(pathCfg.src.templates)
      //.pipe(watch(pathCfg.src.templates))
      .pipe(templateCache({
        root:""
      }))
      .pipe(gulp.dest(pathCfg.build.js))
      //.pipe(gulp.start('webserver:reload'))

    cb()
  });


  gulp.task('modernizr:build', function(){
    return gulp.src(pathCfg.src.js)
      .pipe(modernizr())
      .pipe(gulp.dest(pathCfg.build.js))
  });

  /**
   * Сбор скриптов 'gulp js:build'
   */
  gulp.task('js:build', function () {
    return gulp.src(pathCfg.src.js)
    //gulp.src(pathCfg.src.ts)
      //.pipe(logger({
      //  before: 'Mr TypescriptCompiler is compiling *.ts files...',
      //  display: 'name'
      //}))
      //.pipe(tsc())
      //
      //.pipe(logger({
      //  before: 'Mr Rigger is concating *.js files into one...',
      //  display: 'name'
      //}))
      //.pipe(sourcemaps.init())
      //
      //.pipe(addsrc(pathCfg.src.js))
      .pipe(rigger())
      .pipe(logger({
        before: 'Mr Concatenator is concating *.js and *.ts files into one...',
        display: 'name'
      }))
      .pipe(concat('main.js'))
      .pipe(gulpif(options.minify, logger({
        before: 'Mr Minify is minifying js file...',
        display: 'name'
      })))
      .pipe(gulpif(options.minify, minify()))
      .pipe(gulpif(options.minify, ignore.exclude('main.js')))
      .pipe(rename({
        basename: 'main',
        suffix: '.min'
      }))
      //.pipe(sourcemaps.write())

      .pipe(logger({
        before: 'Mr Gulp is deploying file...',
        display: 'name'
      }))
      .pipe(gulp.dest(pathCfg.build.js))
  });


  /**
   * Сбор либов 'gulp js-lib:build'
   */
  gulp.task('js-lib:build', function () {
    return gulp.src(pathCfg.src.libs)
      .pipe(concat('lib.min.js'))
      //.pipe(gulpif(options.minify, minify()))
      //.pipe(gulpif(options.minify, ignore.exclude('lib.js')))
      //.pipe(rename({
      //  basename: 'lib',
      //  suffix: '.min'
      //}))
      .pipe(gulp.dest(pathCfg.build.libs))

  });

//Styles=======================================================================
  /**
   * Сбор стилей 'gulp style:build'
   */

  gulp.task('style:build', function (callback) {
    runSequence('style:build-tmp', 'theme:build', 'theme:clear-tmp', callback);
  });

  gulp.task('style:build-tmp', function () {

    return gulp.src('./src/sass/themes/' + current_module.theme + '.scss')
      .pipe(logger({
        before: 'Mr Compass is making magic...',
        display: 'name'
      }))
      //.pipe(sourcemaps.init())
      .pipe(compass({
        sourceMap: true,
        errLogTogutil: true,
        sass: './src/sass/',
        css: pathCfg.build.css,
        font: 'fonts',
        debug: true,
        relative: true
      }))
      .pipe(logger({
        before: 'Mr Autoprefixer adapts our styles...',
        display: 'name'
      }))
      .pipe(prefixer())
      .pipe(gulpif(options.minify, logger({
        before: 'Mr Cssnano is minifying our styles...',
        display: 'name'
      })))
      .pipe(gulpif(options.minify, cssnano()))
      //.pipe(sourcemaps.write())

      .pipe(logger({
        before: 'Mr Gulp is deploying our styles...',
        display: 'name'
      }))
      .pipe(gulp.dest(pathCfg.build.css))
  });

  gulp.task('theme:build', function () {
    return gulp.src(pathCfg.build.css + 'themes/' + current_module.theme + '.css')
      .pipe(rename({
        basename: 'main'
      }))
      .pipe(gulp.dest(pathCfg.build.css));
  });

  gulp.task('theme:clear-tmp', function () {
    return del(pathCfg.build.css + 'themes/**')
  });
//=================================================================================

  /**
   * Deploy lib css
   */
  gulp.task('lib:css', function () {
    return gulp.src(pathCfg.src.libCSS)
      .pipe(concatCss('lib.css',{
        rebaseUrls:false,
        includePaths:['../fonts']
      }))
      .pipe(gulp.dest(pathCfg.build.css))
  });

  /**
   * Сбор картинок 'gulp image:build'
   */
  gulp.task('image:build', function () {
    if (!options.images) return gutil.log('No images');
    return gulp.src(pathCfg.src.img)
      .pipe(watch(pathCfg.src.img))
      .pipe(gulpif(options.minify, imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()],
        interlaced: true
      })))
      .pipe(gulp.dest(pathCfg.build.img))
      .pipe(gulp.start('webserver:reload'))
  });

  /**
   * Theme-imgs
   */
  gulp.task('theme-img:build', function () {
    return gulp.src(pathCfg.src.theme)
      .pipe(watch(pathCfg.src.theme))
      .pipe(gulpif(options.minify, imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()],
        interlaced: true
      })))
      .pipe(gulp.dest(pathCfg.build.theme))
      .pipe(gulp.start('webserver:reload'))
  });

  /**
   * Сбор шрифтов
   */
  gulp.task('fonts:build', function () {
    gutil.log('fonts:build');
    return gulp.src(pathCfg.src.fonts)
      .pipe(watch(pathCfg.src.fonts))
      .pipe(gulp.dest(pathCfg.build.fonts))
      .pipe(gulp.start('webserver:reload'))
  });

  /**
   * Сбор отдельных страниц
   */
  gulp.task('pages:build', function () {
    gutil.log('pages:build');
    return gulp.src(pathCfg.src.pages)
      .pipe(watch(pathCfg.src.pages))
      .pipe(gulp.dest(pathCfg.build.pages))
      .pipe(gulp.start('webserver:reload'))
  });

  /**
   * Сбор файлов с данными
   */
  gulp.task('data:build', function () {
    gutil.log('data:build');
    return gulp.src(pathCfg.src.data)
      .pipe(watch(pathCfg.src.data))
      .pipe(gulp.dest(pathCfg.build.data))
      .pipe(gulp.start('webserver:reload'))
  });

  /**
   * Сбор файлов с видео
   */
  gulp.task('video:build', function () {
    gutil.log('video:build');
    return gulp.src(pathCfg.src.video)
      .pipe(watch(pathCfg.src.video))
      .pipe(gulp.dest(pathCfg.build.video))
      .pipe(gulp.start('webserver:reload'))
  });


  gulp.task('manifest', function () {
    if (!options.manifest) return gutil.log('No manifest');
    gulp.src(current_module.build + '**')
      .pipe(manifest({
        version: '1.2',
        courseId: current_module.name,
        SCOtitle: current_module.title,
        moduleTitle: current_module.title,
        launchPage: 'index.html',
        //pathCfg: 'data',
        fileName: 'imsmanifest.xml'
      }))
      .pipe(gulp.dest(pathCfg.build.html))
  });


  gulp.task('zip', function () {
    if (!options.zip) return gutil.log('No zip');
    return gulp.src(pathCfg.build.html + '**/*.*')
      .pipe(logger({
        before: 'Mr ZIP is compressing...',
        display: 'name'
      }))
      .pipe(zip(current_module.name + '.zip'))
      .pipe(gulp.dest('./build/'));
  });
};
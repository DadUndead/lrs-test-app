/**
 * Gulp configuration file
 * All gulp modules are in ./gulp/ dir
 **/

"use strict";

var gulp = require('gulp');
var gutil = require('gulp-util');
var fs = require('fs');
var runSequence = require('run-sequence').use(gulp);    //запуск задач в нужном порядке (в каждой задаче нужен return)

//Module objects ===================================================================
var modules =  function() {
  var m = [];
  fs.readdirSync('./src/modules').map(function (file) {
    var module ={
      id:m.length,
      name:file,
      title:file,
      src: './src/modules/'+file+'/',
      build: './build/'+file+'/',
      build_fonts: './build/'+file+'/',
      course_org: file

    };
    m.push(module)
  });
  return m;
};

//Current module (depends on task) =================================================
var current_module = {};

var options = {
  images: true,
  watch: true,
  server: true,
  minify: false,
  tests: false,
  zip: false,
  manifest: false
};

//Build params===========================================================================================
var bower_dir = './bower_components/';
var node_dir = './node_modules/';

//Path object - define paths for tasks =============================================
var getPath = function (current_module) {
  return {
    build: {
      //Module custom build ==========================================================
      html: current_module.build,
      js: current_module.build + 'js/',
      libs: current_module.build + 'js/',
      css: current_module.build + 'css/',
      img: current_module.build + 'img/',
      fonts: current_module.build + 'fonts/',
      json: current_module.build + 'json/',
      theme: current_module.build + 'theme/',
      pages: current_module.build + 'pages/',
      templates: current_module.build + 'templates/',
      data: current_module.build + 'data/',
      video: current_module.build + 'video/'

    },
    src: {

      //Common sources ===============================================================
      html: ['./src/index.html',current_module.src+'index.html'],
      templates: [
        './src/engine/app/directives/**/*.html',
        current_module.src+'/templates/**/*.html'
      ],
      ts: './src/engine/**/*.ts',
      js: './src/engine/main.js',
      libs: [
        bower_dir + 'jquery/dist/jquery.min.js',
        bower_dir + 'angular/angular.min.js',
        bower_dir + 'angular-animate/angular-animate.min.js',
        bower_dir + 'angular-aria/angular-aria.min.js',
        bower_dir + 'angular-messages/angular-messages.min.js',
        bower_dir + 'angular-sanitize/angular-sanitize.min.js',
        bower_dir + 'angular-route/angular-route.min.js',
        bower_dir + 'angular-material/angular-material.min.js',
        bower_dir + 'ngstorage/ngStorage.min.js',
        bower_dir + 'tincan/build/tincan.js',
        bower_dir + 'highlightjs/highlight.pack.min.js',
        bower_dir + 'angular-highlightjs/build/angular-highlightjs.js'
      ],
      style_scss: './src/sass/*.scss',
      style: './src/sass/',
      fonts: [
        './fonts/**/*.*',
        bower_dir + 'mobile-angular-ui/dist/fonts/*.*',
        bower_dir + 'mdi/fonts/*.*'
      ],
      theme: './src/themes/' + current_module.theme + '/**/*.*',

      //Common libs ==================================================================
      libCSS: [
        './src/sass/lib/**/*.css',
        bower_dir + 'angular-material/angular-material.min.css',
        bower_dir + 'highlightjs/styles/darkula.css',
        bower_dir + 'mdi/css/materialdesignicons.min.css'
      ],

      //Module custom sources =========================================================
      img: ['./src/common/img/**/*.*', current_module.src + 'assets/**/*.*', current_module.src + 'img/**/*.*'],
      pages: current_module.src + 'pages/**/*.*',
      data: ['./src/common/data/**/*.*', current_module.src + 'data/**/*.*'],
      video: [current_module.src + 'video/**/*.*']
    },
    watch: {

      //Common watcher ================================================================
      html: './src/index.html',
      templates: ['./src/engine/**/*.html',current_module.src +'/**/*.html'],
      js: ['./src/engine/**/*.js'],
      style: [
        './src/sass/**/*.scss',
        './src/sass/lib/**/*.*',
        bower_dir + 'highlightjs/styles/dracula.css'
      ],
      fonts: './src/fonts/**/*.*',
      pages: current_module.src + 'pages/**/*.*',
      data: ['./src/common/data/**/*.*', current_module.src + 'data/**/*.*'],
      video: [current_module.src + 'video/**/*.*'],

      //Custom watcher ================================================================
      img: ['./src/common/img/**/*.*', current_module.src + 'assets/**/*.*', current_module.src + 'img/**/*.*']
    }
  };
};


function setConfig() {
  for (var i = 0; i < process.argv.length; i++) {
    if (process.argv[i] == '--no-images') {
      options.images = false;
    }
    if (process.argv[i] == '--no-watch') {
      options.watch = false;
    }
    if (process.argv[i] == '--minify') {
      options.minify = true;
    }
    if (process.argv[i] == '--tests') {
      options.tests = true;
    }
    if (process.argv[i] == '--zip') {
      options.zip = true;
    }
  }

  var mods = modules();
  for (var i = 0; i < process.argv.length; i++) {

    if (process.argv[i] == '--id') {
      gutil.log('id=>>', process.argv[i + 1]);
      current_module = mods[process.argv[i + 1]];
      break;
    }
    if (process.argv[i] == '--module') {
      gutil.log('module=>>', process.argv[i + 1]);

      for (var j = 0; j < mods.length; j++) {
        if (mods[j].name == process.argv[i + 1]) {
          current_module = mods[j];
          break;
        }
      }
    }
  }

  /**
   * Подключаем модули для сборщика
   * Передаем в них параметры
   *
   */

  fs.readdirSync('./gulp').map(function (file) {
    require('./gulp/' + file)(options, current_module, getPath(current_module));
  });
}


/**
 * Запуск сборки 'gulp'
 */

gulp.task('do', function (callback) {
  setConfig();

  gulp.start('build');

  callback();
});

/**
 * Общий сбор
 // */

gulp.task('build', function (callback) {

  runSequence(
    'clean-all',
    [
      'modernizr:build',
      'js:build',
      'image:build',
      'theme-img:build',
      'fonts:build',
      'js-lib:build',
      'style:build',
      'lib:css',
      'pages:build',
      'data:build',
      'video:build'],
    'templates:build',
    'html:build',
    'webserver',
    'manifest',
    'watch',
    'tdd',
    'zip',
    callback);
});
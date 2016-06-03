//"use strict";
//
////===========================================
var gulp = require('gulp');
var watch = require('gulp-watch');           //следит за изменениями файлов и запускает конкретные сборки

//var del = require('del');
//var cordova = require('cordova-lib').cordova;
//
//var APP_PATH = './src';
//var CORDOVA_PATH = './cordova/www';
//
//
module.exports = function (options, current_module, pathCfg) {

  var pathToBuild = [current_module.build +'/index.html', current_module.build + '/**/*.*'];
  /**
   * Копирует папку build в проект cordova
   **/
  gulp.task('cordova:build', function () {
    return gulp.src(pathToBuild)
      .pipe(gulp.dest('_cordova/' + current_module.name + '/www/'));
  });

  gulp.task('cordova:watch', function () {
    watch(pathToBuild, function (event, cb) {
      gulp.start('cordova:build');
    });
  });


};
//
//
//  gulp.task("cordova:default", function (callback) {
//    cordova.build({
//      "platforms": ["android","ios"],
//      "options": {
//        argv: ["--release","--gradleArg=--no-daemon"]
//      }
//    }, callback);
//  });
//
//  gulp.task('cordova:recreate', function(cb){
//    cordova.create()
//  });
//
//  gulp.task('del-cordova', function(cb) {
//    del([ CORDOVA_PATH + '/*' ])
//      .then(function() {
//        cb();
//      });
//  });
//
//  gulp.task('compile', [ 'del-cordova' ], function(cb) {
//    return gulp.src([ APP_PATH + '/**/*' ])
//      .pipe(gulp.dest(CORDOVA_PATH));
//  });
//
//  gulp.task('build', [ 'compile' ], function(cb) {
//    process.chdir(__dirname + '/cordova');
//    cordova
//      .build()
//      .then(function() {
//        process.chdir('../');
//        cb();
//      });
//  });
//
//  gulp.task('emulate', [ 'compile' ], function(cb) {
//    process.chdir(__dirname + '/cordova');
//    cordova
//      .run({ platforms: [ 'ios' ] })
//      .then(function() {
//        process.chdir('../');
//        cb();
//      });
//  });
//
//}
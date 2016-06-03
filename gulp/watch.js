/**
 * Created by aklimenko on 22.04.16.
 */
"use strict";

//Default plugins-----------------
var gulp = require('gulp');

var watch = require('gulp-watch');           //следит за изменениями файлов и запускает конкретные сборки


var runSequence = require('run-sequence');    //запуск задач в нужном порядке (в каждой задаче нужен return)

module.exports = function (options, current_module, pathCfg) {

  /**
   * Обновление изменения файлов 'gulp watch'
   */
  gulp.task('watch', function (cb) {
    if (!options.watch) return gutil.log('No watcher');
    //watch(pathCfg.watch.html, function (event, cb) {
    //  gulp.start('html:build');
    //});

    watch(pathCfg.watch.style, function (event, cb) {
      gulp.start('style:build');
    });

    watch(pathCfg.watch.js, function (event, cb) {
      gulp.start('js:build');
    });

    watch(pathCfg.watch.js, function (event, cb) {
      gulp.start('js-lib:build');
    });

    if (options.images) {
      //watch(pathCfg.watch.img, function (event, cb) {
      //  gulp.start('image:build');
      //});
    } else {
      gutil.log('No watcher images');
    }

    watch([pathCfg.watch.fonts], function (event, cb) {
      //gulp.start('fonts:build');
    });

    watch([pathCfg.watch.pages], function (event, cb) {
      //gulp.start('pages:build');
    });

    watch(pathCfg.watch.data, function (event, cb) {
      //gulp.start('data:build');
    });

    watch(pathCfg.watch.data, function (event, cb) {
      //gulp.start('video:build');
    });

    //watch(pathCfg.watch.templates, function (event, cb) {
    //  gulp.start('templates:build');
    //});
  });

  gulp.task('style:watch', function () {
    watch(pathCfg.watch.style, function (event, cb) {
      gulp.start('style-tmp:build');
    });
  });

};
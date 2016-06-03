/**
 * Created by aklimenko on 22.04.16.
 */
"use strict";

//Default plugins-----------------
var gulp = require('gulp');

//WebServer-------------------------
var browserSync = require("browser-sync");   //запуск сервера и синхронизация
var reload = browserSync.reload;


var watch = require('gulp-watch');           //следит за изменениями файлов и запускает конкретные сборки

module.exports = function (options, current_module, pathCfg) {

  /**
   * Конфигурация сервера
   * @type {{server: {baseDir: string}, tunnel: boolean, host: string, port: number, logPrefix: string}}
   */
  function webConfig() {
    return {
      server: {
        baseDir: current_module.build
      },
      tunnel: false,
      host: 'localhost',
      port: 9800 + current_module.id,
      open:true,
      logPrefix: current_module.name,
      files: current_module.build+'**/*.*'
    };
  }

  /**
   * Веб-сервер
   */
  gulp.task('webserver', function () {
    if (!options.server) return gutil.log('No server');

    browserSync(webConfig());

    if (!options.watch) return gutil.log('No watcher');

    //browserSync.watch(current_module.build+'**/*.*', function (event, cb) {
    //  gulp.start('webserver:reload');
    //});
  });

  gulp.task('webserver:reload', function () {
    if (!options.server) return gutil.log('No server');
    return reload({stream:true});
  });

};
/**
 * Created by aklimenko on 22.04.16.
 */
'use strict';

//Default plugins-----------------
var gulp = require('gulp');
var gutil = require('gulp-util');

//Karma unit testing==============
var Server = require('karma').Server;

module.exports = function (options, current_module, pathCfg) {

  /**
   * Run test once and exit
   */
  gulp.task('test', function (done) {
    new Server({
      configFile: __dirname + '/../karma.conf.js',
      basePath:current_module.build,
      singleRun: true
    }, done).start();
  });

  /**
   * Watch for file changes and re-run tests on each change
   */
  gulp.task('tdd', function (done) {
    if (!options.tests) {
      gutil.log('No tests ')
      return null;
    }
    new Server({
      configFile: __dirname + '/../karma.conf.js',
      basePath:current_module.build
    }, done).start();
  });
};
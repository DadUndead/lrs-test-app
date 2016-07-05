/**
 * Created by aklimenko on 05.07.2016.
 */
"use strict";

angular.module('coreApp')
  .controller('TestGetStateCtrl', [
    '$scope',
    '$localStorage',
    'TinCanManager',
    function ($scope, $localStorage, TinCanManager) {
      var self = this;

      self.progress = {};

      self.getState = function (key) {
        console.log('getState:', key);
        TinCanManager.getState(key).then(
          function (response) {
            console.log('get State resolved:', response);
            self.requestResults = response;
          },
          function (err) {
            console.log('get State rejected:', err);
            self.requestResults = err;
          }
        );
      }


    }]);
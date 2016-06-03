/**
 * Created by User on 6/3/2016.
 */
angular.module('coreApp')
  .controller('TestSaveStateCtrl',
    [
      '$scope',
      '$localStorage',
      'TinCanManager',
      'TestTinCanService',
      function ($scope, $localStorage, TinCanManager, TestTinCanService) {
        var self = this;
        self.progress = {
          position: {
            chapter: 1,
            page: 2,
            component: 3
          },
          scores: [100, 10, 0, 20]
        };

        self.saveState = function (key,value) {
          TinCanManager.sendState(key,value).then(
            function(response){
              console.log('save State resolved:', response);
              self.requestResults = response;
            },
            function(err){
              console.log('save State rejected:', err);
              self.requestResults = err;
            }
          );
        }
      }]);
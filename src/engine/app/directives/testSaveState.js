/**
 * Created by User on 6/3/2016.
 */

angular.module('coreApp')
  .directive('testSaveState', [function () {
    return {
      replace: false,
      link: function () {

      },
      templateUrl:'testSaveStateTmp.html'
    }
  }]);
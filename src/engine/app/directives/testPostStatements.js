/**
 * Created by User on 6/3/2016.
 */

angular.module('coreApp')
  .directive('testPostStatements', [function () {
    return {
      replace: false,
      link: function () {

      },
      templateUrl:'testPostStatementsTmp.html'
    }
  }]);
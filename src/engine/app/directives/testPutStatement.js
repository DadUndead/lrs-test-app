/**
 * Created by User on 6/3/2016.
 */

angular.module('coreApp')
  .directive('testPutStatement', [function () {
    return {
      replace: false,
      link: function () {

      },
      templateUrl:'templates/testPutStatementTmp.html'
    }
  }]);
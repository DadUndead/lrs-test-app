/**
 * Created by aklimenko on 05.07.2016.
 */
/**
 * @ngdoc directive
 * @name coreApp:requestResults
 *
 * @description
 *
 *
 * @restrict E
 * */
angular.module('coreApp')
  .directive('requestResults', function () {
    return {
      restrict: 'E',
      link: function (scope, elem, attr) {

      },
      scope: {
        errors: '=',
        successed: '=',
      },
      templateUrl: 'requestResultsTmp.html'
    };
  });

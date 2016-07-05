/**
 * Created by User on 6/3/2016.
 */

angular.module('coreApp')
  .directive('setupLrs', [function () {
    return {
      replace: false,
      link: function () {
      },
      scope: {
        showAddLrsDialog: '='
      },
      templateUrl: 'setupLrsTmp.html'
    }
  }]);
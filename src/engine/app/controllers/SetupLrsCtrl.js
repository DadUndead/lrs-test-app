/**
 * Created by User on 6/3/2016.
 */
angular.module('coreApp')
  .controller('SetupLrsCtrl',
    [
      '$scope',
      '$localStorage',
      'TinCanManager',
      'TestTinCanService',
      '$tincanConfig',
      function ($scope,
                $localStorage,
                TinCanManager,
                TestTinCanService,
                $tincanConfig) {
        var ctrl = this;
        ctrl.lrsList = $tincanConfig.lrs;
        ctrl.lrsObjects = TinCanManager.get.lrsList;

        ctrl.addLrs = function (id, endpoint, username, pwd) {
          $tincanConfig.lrs.push(
            {
              "id": id,
              "endpoint": endpoint,
              "username": username,
              "password": pwd
            });
          ctrl.lrsList = $tincanConfig.lrs;
          ctrl.lrsObjects = TinCanManager.get.lrsList;
          ctrl.lrsId='';
          ctrl.lrsEndpoint='';
          ctrl.lrsUsername='';
          ctrl.lrsPassword='';
        };

        ctrl.removeLrs = function(index){
          $tincanConfig.lrs.splice(index,1);
          ctrl.lrsList = $tincanConfig.lrs;
          ctrl.lrsObjects = TinCanManager.get.lrsList;
        };
      }]);
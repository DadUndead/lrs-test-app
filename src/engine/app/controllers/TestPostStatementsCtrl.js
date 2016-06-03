/**
 * Created by User on 6/3/2016.
 */
angular.module('coreApp')
  .controller('TestPostStatementsCtrl',
    [
      '$scope',
      '$localStorage',
      'TinCanManager',
      'TestTinCanService',
      function ($scope, $localStorage,TinCanManager, TestTinCanService) {
        var self = this;

        self.verbs = TestTinCanService.getAllVerbs();
        self.actors = TestTinCanService.getAllActors();
        self.activities = TestTinCanService.getAllActivities();
        self.statements = $localStorage.statements =[];

        self.addRandomStatement = function () {
          var actor = self.actors[Math.floor(Math.random()*self.actors.length)];
          var activity = self.activities[Math.floor(Math.random()*self.activities.length)];
          var verb = self.verbs[Math.floor(Math.random()*self.verbs.length)];


          var stmt = new TinCan.Statement({
            actor: actor,
            target: new TinCan.Activity({
              id: activity.id,
              definition: new TinCan.ActivityDefinition({
                name: activity.definition.name,
                description: activity.definition.description,
                type: activity.definition.type
              })
            }),
            verb: verb
          }, {
            storeOriginal: false,
            doStamp: true
          });

          if (!$localStorage.statements.length) $localStorage.statements=[];
          $localStorage.statements.push(stmt);
          self.statements = $localStorage.statements;
        };

        self.removeStatement = function(index){
          $localStorage.statements.splice(index,1);
        };

        self.sendStatements = function(){
          TinCanManager.sendStatements().then(
            function (response) {
              console.log('sendStatements resolved:', response);
              self.requestResults = response;
            },
            function (err) {
              console.log('sendStatements rejected:', err);
              self.requestResults = err;
            }
          )
        }
      }]);
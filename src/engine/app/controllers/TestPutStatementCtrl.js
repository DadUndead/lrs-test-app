/**
 * Created by User on 6/3/2016.
 */
angular.module('coreApp')
  .controller('TestPutStatementCtrl',
    [
      '$scope',
      '$localStorage',
      'TinCanManager',
      'TestTinCanService',
      function ($scope, $localStorage, TinCanManager, TestTinCanService) {
        var self = this;

        self.verbs = TestTinCanService.getAllVerbs();
        self.actors = TestTinCanService.getAllActors();
        self.activities = TestTinCanService.getAllActivities();

        self.getStatement = function () {

          var actor = self.actors[self.actor];
          var activity = self.activities[self.activity];
          var verb = self.verbs[self.verb];

          if (actor && activity && verb) {
            return new TinCan.Statement({
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
            })
          } else {
            return null
          }
        };

        self.sendStatement = function () {
          if (self.getStatement()) {
            TinCanManager.sendStatement(self.getStatement()).then(
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
        };
      }]);
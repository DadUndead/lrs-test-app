/**
 * Created by aklimenko on 09.04.2016.
 *
 * Generates statements to in TinCan format
 */
"use strict";

coreApp.factory('TinCanStatement', ['TinCanManager', '$localStorage', function (TinCanManager, $localStorage) {
  /** https://github.com/adlnet/xAPI-Spec/blob/master/xAPI.md#40-statement **/

  //TODO: set context to course/chapter
  //context: {
  //  contextActivities: {
  //    grouping: [
  //      {
  //        id: "http://adlnet.gov/courses/compsci/CS204/",
  //        definition: {
  //          name: {
  //            "en-US": "CS204"
  //          },
  //          description: {
  //            "en-US": "The activity representing the course CS204"
  //          },
  //          type: "http://adlnet.gov/expapi/activities/course"
  //        }
  //      },
  //      {
  //        id: "http://adlnet.gov/courses/compsci/CS204/lesson01/01?attemptId=50fd6961-ab6c-4e75-e6c7-ca42dce50dd6",
  //        definition: {
  //          name: {
  //            "en-US": "Attempt of CS204 lesson 01"
  //          },
  //          description: {
  //            "en-US": "The activity representing an attempt of lesson 01 in the course CS204"
  //          },
  //          type: "http://adlnet.gov/expapi/activities/attempt"
  //        }
  //      }
  //    ],
  //    category: [
  //      {
  //        id: "https://w3id.org/xapi/adl/profiles/scorm"
  //      }
  //    ]
  //  }
  //}
  //},{
  //  storeOriginal:false, //-true if we need to store statement as JSON and get it later by |statement.originalJSON|
  //  doStamp:true //Whether to automatically set the 'id' and 'timestamp' properties (default: true)
  //});

  return {
    /** http://xapi.vocab.pub/datasets/adl/ **/

    /** http://activitystrea.ms/specs/json/schema/activity-schema.html **/
    //курс запущен
    courseAttempted: new TinCan.Statement({
      actor: TinCanManager.get.defaultActor,
      target: TinCanManager.get.courseActivity,
      verb: TinCanManager.get.VERB.attempted
    }, {
      storeOriginal: false, //-true if we need to store statement as JSON and get it later by |statement.originalJSON|
      doStamp: true //Whether to automatically set the 'id' and 'timestamp' properties (default: true)
    }),

    //курс приостановлен
    courseSuspended: function (score) {
      new TinCan.Statement({
        actor: TinCanManager.get.defaultActor,
        target: TinCanManager.get.courseActivity,
        verb: TinCanManager.get.VERB.suspended,
        result: new TinCan.Result({
          score: new TinCan.Score({
            scaled: $localStorage.progress.course.score
          })
        })
      }, {
        storeOriginal: false,
        doStamp: true
      })
    },

    //курс закрыт
    courseExited: function (score) {
      new TinCan.Statement({
        actor: TinCanManager.get.defaultActor,
        target: TinCanManager.get.courseActivity,
        verb: TinCanManager.get.VERB.exited,
        result: new TinCan.Result({
          score: new TinCan.Score({
            scaled: $localStorage.progress.course.score
          })
        })
      }, {
        storeOriginal: false,
        doStamp: true
      })
    },

    //курс успешно завершен
    courseCompleted: function (score) {
      new TinCan.Statement({
        actor: TinCanManager.get.defaultActor,
        target: TinCanManager.courseActivity,
        verb: TinCanManager.VERB.completed,
        result: new TinCan.Result({
          score: new TinCan.Score({
            scaled: score
            //min:0,
            //max:100,
            //raw:score_raw
          })
        })
      }, {
        storeOriginal: false,
        doStamp: true
      })
    },

    //глава начата
    chapterInitialized: function (chapter) {
      return new TinCan.Statement({
        actor: TinCanManager.get.defaultActor,
        target: new TinCan.Activity({
          id: "http://adlnet.gov/courses/" + $localStorage.progress.course.id + "/" + chapter.id,
          definition: new TinCan.ActivityDefinition({
            name: chapter.name,
            description: chapter.description,
            type: "http://adlnet.gov/expapi/activities/chapter"
          })
        }),
        verb: TinCanManager.get.VERB.initialized
      }, {
        storeOriginal: false,
        doStamp: true
      })
    },

    //глава завершена
    chapterPassed: function (chapter) {
      return new TinCan.Statement({
        actor: TinCanManager.get.defaultActor,
        target: new TinCan.Activity({
          id: "http://adlnet.gov/courses/" + $localStorage.progress.course.id + "/" + chapter.id,
          definition: new TinCan.ActivityDefinition({
            name: chapter.name,
            description: chapter.description,
            type: "http://adlnet.gov/expapi/activities/chapter"
          })
        }),
        verb: TinCanManager.get.VERB.passed
      }, {
        storeOriginal: false,
        doStamp: true
      })
    },

    //страница просмотрена
    lessonExperienced: function (chapter, page) {
      return new TinCan.Statement({
        actor: TinCanManager.get.defaultActor,
        target: new TinCan.Activity({
          id: "http://adlnet.gov/courses/" +
          $localStorage.progress.course.id + "/" +
          chapter.id + "/" +
          page.id,
          definition: new TinCan.ActivityDefinition({
            name: page.name,
            description: page.description,
            type: "http://adlnet.gov/expapi/activities/lesson"
          })
        }),
        verb: TinCanManager.get.VERB.experienced
      }, {
        storeOriginal: false,
        doStamp: true
      })
    },

    //картинка/текст/видео просмотрены
    mediaExperienced: function (chapter, page, media) {
      return new TinCan.Statement({
        actor: TinCanManager.get.defaultActor,
        target: new TinCan.Activity({
          id: "http://adlnet.gov/courses/" +
          $localStorage.progress.course.id + "/" +
          chapter.id + "/" +
          page.id + "/" +
          media.id,
          definition: new TinCan.ActivityDefinition({
            name: media.name,
            description: media.description,
            type: "http://adlnet.gov/expapi/activities/media"
          })
        }),
        verb: TinCanManager.get.VERB.experienced
      }, {
        storeOriginal: false,
        doStamp: true
      })
    },

    //интерактив начат
    interactionAttempted: function (chapter, page, interaction) {
      return new TinCan.Statement({
        actor: TinCanManager.get.defaultActor,
        target: new TinCan.Activity({
          id: "http://adlnet.gov/courses/" +
          $localStorage.progress.course.id + "/" +
          chapter.id + "/" +
          page.id + "/" +
          interaction.id,
          definition: new TinCan.ActivityDefinition({
            name: interaction.name,
            description: interaction.description,
            type: "http://adlnet.gov/expapi/activities/interaction"
          })
        }),
        verb: TinCanManager.get.VERB.attempted
      }, {
        storeOriginal: false,
        doStamp: true
      })
    },

    //интерактив пройден
    interactionPassed: function (chapter, page, interaction) {
      return new TinCan.Statement({
        actor: TinCanManager.get.defaultActor,
        target: new TinCan.Activity({
          id: "http://adlnet.gov/courses/" +
          $localStorage.progress.course.id + "/" +
          chapter.id + "/" +
          page.id + "/" +
          interaction.id,
          definition: new TinCan.ActivityDefinition({
            name: interaction.name,
            description: interaction.description,
            type: "http://adlnet.gov/expapi/activities/interaction"
          })
        }),
        verb: TinCanManager.get.VERB.passed,
        result: new TinCan.Result({
          score: new TinCan.Score(interaction.score)
        })
      }, {
        storeOriginal: false,
        doStamp: true
      })
    },

    //интерактив завершен неудачно
    interactionFailed: function (chapter, page, interaction) {
      return new TinCan.Statement({
        actor: TinCanManager.get.defaultActor,
        target: new TinCan.Activity({
          id: "http://adlnet.gov/courses/" +
          $localStorage.progress.course.id + "/" +
          chapter.id + "/" +
          page.id + "/" +
          interaction.id,
          definition: new TinCan.ActivityDefinition({
            name: interaction.name,
            description: interaction.description,
            type: "http://adlnet.gov/expapi/activities/interaction"
          })
        }),
        verb: TinCanManager.get.VERB.failed,
        result: new TinCan.Result({
          score: new TinCan.Score(interaction.score)
        })
      }, {
        storeOriginal: false,
        doStamp: true
      })
    },

    //интерактив завершен успешно
    interactionMastered: function (chapter, page, interaction) {
      return new TinCan.Statement({
        actor: TinCanManager.get.defaultActor,
        target: new TinCan.Activity({
          id: "http://adlnet.gov/courses/" +
          $localStorage.progress.course.id + "/" +
          chapter.id + "/" +
          page.id + "/" +
          interaction.id,
          definition: new TinCan.ActivityDefinition({
            name: interaction.name,
            description: interaction.description,
            type: "http://adlnet.gov/expapi/activities/interaction"
          })
        }),
        verb: TinCanManager.get.VERB.mastered,
        result: new TinCan.Result({
          score: new TinCan.Score(interaction.score)
        })
      }, {
        storeOriginal: false,
        doStamp: true
      })
    },

    //обнулить statement
    voidStatement: function (id) {
      return new TinCan.Statement({
        actor: TinCanManager.get.defaultActor,
        verb: TinCanManager.get.VERB.voided,
        object: new TinCan.StatementRef({
          id: id
        })
      }, {
        storeOriginal: false,
        doStamp: true
      })
    }


  }
}]);

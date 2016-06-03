/**
 * Created by ralic on 10.04.2016.
 */

"use strict";

coreApp.factory('TestTinCanService', ['$q', '$localStorage', 'TinCanManager',
  function ($q, $localStorage, TinCanManager) {

    var TestTinCan = {};

    var sampleModule = {
      id: 'chapter0',
      name: {
        "en-US": "chapter0",
        "ru": "Глава 0"
      },
      description: {
        "en-US": "Description for Course Chapter 0",
        "ru": "Описание нулевой главы"
      }
    };

    var samplePage = {
      id: 'page0',
      name: {
        "en-US": "page0",
        "ru": "Страница 0"
      },
      description: {
        "en-US": "Description for Course Chapter Page 0",
        "ru": "Описание нулевой страницы"
      }
    };

    var sampleMedia = {
      id: 'media0',
      name: {
        "en-US": "Video0",
        "ru": "Видео 0"
      },
      description: {
        "en-US": "Description for Course Chapter Page Video 0",
        "ru": "Описание видео в нулевой странице"
      }
    };

    var sampleInteraction = {
      id: 'interaction0',
      name: {
        "en-US": "Interaction0",
        "ru": "Интерактив 0"
      },
      description: {
        "en-US": "Description for Course Chapter Page Interaction 0",
        "ru": "Описание для видео 0 на странице 0 в главе 0 в курсе"
      },
      score: {
        completion: true,
        score: 1
      }
    };

    //$localStorage.statements.push(TinCanStatement.courseAttempted);
    //$localStorage.statements.push(TinCanStatement.courseSuspended);
    //$localStorage.statements.push(TinCanStatement.courseCompleted);
    //$localStorage.statements.push(TinCanStatement.courseExited);
    //$localStorage.statements.push(TinCanStatement.moduleInitialized(sampleModule));
    //$localStorage.statements.push(TinCanStatement.lessonExperienced(sampleModule, samplePage));
    //$localStorage.statements.push(TinCanStatement.mediaExperienced(sampleModule, samplePage, sampleMedia));
    //$localStorage.statements.push(TinCanStatement.interactionAttempted(sampleModule, samplePage, sampleInteraction));
    //$localStorage.statements.push(TinCanStatement.interactionPassed(sampleModule, samplePage, sampleInteraction));
    //$localStorage.statements.push(TinCanStatement.interactionFailed(sampleModule, samplePage, sampleInteraction));
    //$localStorage.statements.push(TinCanStatement.interactionMastered(sampleModule, samplePage, sampleInteraction));


    function getDataFromLRS(param) {
      var promise = TinCanManager.get(param);
      promise.then(function (sr) {
        console.log('data get -> success:', sr);
      }, function (reason) {
        console.log("can't get data ->", reason);
      });
    }

    function removeStatements(st_selector) {
      var promise = TinCanManager.get(st_selector);
      promise.then(function (sr) {
        console.log('data get -> success:', sr);
        voidStatements(sr);
      }, function (reason) {
        console.log("can't get data ->", reason);
      });

      function voidStatements(statements) {
        $.each(statements, function (key, st) {
          var voidStmt = TinCanStatement.voidStatement(st.id);
          $localStorage.statements.push(voidStmt);
        });
        TinCanManager.send();
      }
    }

    function saveBookmark(location) {
      var promise = TinCanManager.sendState(TinCanManager.STATES.bookmark, location);
      promise.then(function (result) {
        console.log('bookmark saved -> ', result);
        getBookmark();
      }, function (reason) {
        console.log("can't get bookmark ->", reason);
      });
    }

    function getBookmark() {
      var promise = TinCanManager.getState(TinCanManager.STATES.bookmark);
      promise.then(function (result) {
        console.log('Got bookmark -> ', result);
      }, function (reason) {
        console.log("can't get bookmark ->", reason);
      });
    }

    return {

      testSendStatements: function () {
        var sendPromise = TinCanManager.send();
        sendPromise.then(function (resolved) {
          console.log('statement send ->', resolved);
        }, function (reason) {
          console.log("can't send ->", reason);
        });
      },

      testGetStatements: function () {

        var st_selector = {
          agent: new TinCan.Agent({
            mbox: $localStorage.userEmail
          })
        };

        getDataFromLRS(st_selector);
      },

      testRemoveStatements: function () {

        var st_selector = {
          agent: new TinCan.Agent({
            mbox: $localStorage.userEmail
          })
        };

        removeStatements(st_selector);
      },

      testSaveBookmark: function () {
        saveBookmark({chapter: 1, page: 0});
      },

      getAllVerbs: function () {
        return [
          TinCanManager.get.VERB.attempted,
          TinCanManager.get.VERB.initialized,
          TinCanManager.get.VERB.completed,
          TinCanManager.get.VERB.exited,
          TinCanManager.get.VERB.experienced,
          TinCanManager.get.VERB.failed,
          TinCanManager.get.VERB.passed,
          TinCanManager.get.VERB.mastered,
          TinCanManager.get.VERB.suspended,
          TinCanManager.get.VERB.voided
        ];
      },

      getAllActors: function () {
        return [
          {
            "mbox": "mailto:testUser@usermail.com",
            "name": "Mr User"
          },
          {
            "mbox": "mailto:superuser@usermail.com",
            "name": "Super User"
          },
          {
            "mbox": "mailto:admin@usermail.com",
            "name": "Admin"
          }
        ];
      },

      getAllActivities: function () {
        return [
          {
            id: "http://adlnet.gov/courses/courseId",
            definition: {
              name: {
                "ru": "Демо Курс",
                "en-US": "Demo Course"
              },
              description: {
                "ru": "Описание курса на русском языке",
                "en-US": "Course description in English"
              },
              type: "http://adlnet.gov/expapi/activities/course"
            }
          },
          {
            id: "http://adlnet.gov/courses/chapterId",
            definition: {
              name: {
                "ru": "Демо chapter",
                "en-US": "Demo chapter"
              },
              description: {
                "ru": "Описание chapter на русском языке",
                "en-US": "chapter description in English"
              },
              type: "http://adlnet.gov/expapi/activities/chapter"
            }
          },
          {
            id: "http://adlnet.gov/courses/pageId",
            definition: {
              name: {
                "ru": "Демо page",
                "en-US": "Demo page"
              },
              description: {
                "ru": "Описание page на русском языке",
                "en-US": "page description in English"
              },
              type: "http://adlnet.gov/expapi/activities/page"
            }
          },
          {
            id: "http://adlnet.gov/courses/lessonId",
            definition: {
              name: {
                "ru": "Демо lesson",
                "en-US": "Demo lesson"
              },
              description: {
                "ru": "Описание lesson на русском языке",
                "en-US": "lesson description in English"
              },
              type: "http://adlnet.gov/expapi/activities/lesson"
            }
          },
          {
            id: "http://adlnet.gov/courses/interactionId",
            definition: {
              name: {
                "ru": "Демо interaction",
                "en-US": "Demo interaction"
              },
              description: {
                "ru": "Описание interaction на русском языке",
                "en-US": "interaction description in English"
              },
              type: "http://adlnet.gov/expapi/activities/interaction"
            }
          },
          {
            id: "http://adlnet.gov/courses/mediaId",
            definition: {
              name: {
                "ru": "Демо media",
                "en-US": "Demo media"
              },
              description: {
                "ru": "Описание media на русском языке",
                "en-US": "media description in English"
              },
              type: "http://adlnet.gov/expapi/activities/media"
            }
          }
        ];
      }
    }
  }]);
/**
 * Created by aklimenko on 09.04.16.
 *
 * @ngdoc service
 * @name coreApp:TinCanManager
 *
 * @description
 *
 * - sets config from $structure and $tincanConfig values *
 * - creates array of LRS objects
 * - send/retrieves statements to/from lrsList
 * - send/retrieves states to/from lrsList
 *
 * */
"use strict";

angular.module('coreApp')
  .service('TinCanManager', [
    '$q',
    '$localStorage',
    '$tincanConfig',
    function ($q,
              $localStorage,
              $tincanConfig) {

      var TM = this;
      var config = $tincanConfig;
      var _lrsList;

      /**
       * Creates LRS object from config params
       *
       * {
     *   "id": "webtutor",
     *   "endpoint": "",
     *   "username": "user1",
     *   "password": "user1"
     * }
       *
       * @param lrs
       * @returns {*}
       */
      function configLRS(lrs) {
        var _lrs;

        try {
          _lrs = new TinCan.LRS(
            {
              endpoint: lrs.endpoint,
              username: lrs.username,
              password: lrs.password,
              allowFail: false
            }
          );
        } catch (ex) {
          console.log("Failed to setup LRS object: ", ex);
          return null;
        }
        console.log("Successfully setup LRS object", _lrs);

        return _lrs;
      }

      TM.addLrs = function () {

      };

      TM.get = {

        _getLrsList: function () {
          if (_lrsList && _lrsList.length == config.lrs.length) return _lrsList;
          _lrsList = [];
          angular.forEach(config.lrs, function (lrs, lrsNum) {
            var lrs_ready = configLRS(lrs);
            if (lrs_ready) _lrsList.push(lrs_ready)
          });
          return _lrsList;
        },

        get lrsList() {
          return this._getLrsList();
        },

        /**
         *
         * @returns {TinCan.Agent}
         */
        get defaultActor() {
          return new TinCan.Agent({
            //Basic authentification
            mbox: config.defaultActor.mbox, //user e-mail
            name: config.defaultActor.name //user name

            //#################################
            //Identify user by his account in our system
            //Works great with https://cloud.scorm.com/

            //account: new TinCan.AgentAccount({
            //  homePage:'https://cloud.scorm.com/',
            //  name:$localStorage.userAccount
            //})
            //################################
          })
        },

        /**
         *
         * @returns {TinCan.Activity}
         */
        get courseActivity() {
          return new TinCan.Activity({
            id: "http://adlnet.gov/courses/" + config.defaultActivity.id,
            definition: new TinCan.ActivityDefinition({
              name: config.defaultActivity.title,
              description: config.defaultActivity.description,
              type: "http://adlnet.gov/expapi/activities/course"
            })
          });
        },

        /**
         *
         * @returns {{progress}}
         * @constructor
         */
        get STATE() {
          return {
            get progress() {
              return 'progress'
            }
          }
        },

        /**
         * Returns TinCanVerb in different languages
         * @returns {{attempted, suspended, completed, exited, initialized, experienced, passed, failed, mastered, voided}}
         * @constructor
         */
        get VERB() {

          function getVerb(eng, ru) {
            return new TinCan.Verb({
              id: "http://adlnet.gov/expapi/verbs/" + eng,
              display: {
                "en-US": eng,
                "ru": ru
              }
            })
          }

          return {
            get attempted() {
              return getVerb('attempted', 'приступил к')
            },
            get suspended() {
              return getVerb('suspended', 'приостановил')
            },
            get completed() {
              return getVerb('completed', 'окончил')
            },
            get exited() {
              return getVerb('exited', 'закрыл')
            },
            get initialized() {
              return getVerb('initialized', 'начал')
            },
            get experienced() {
              return getVerb('experienced', 'просмотрел')
            },
            get passed() {
              return getVerb('passed', 'прошел')
            },
            get failed() {
              return getVerb('failed', 'провалил')
            },
            get mastered() {
              return getVerb('mastered', 'отлично справился с')
            },
            get voided() {
              return getVerb('voided', 'удалил')
            }
          }
        }
      };

      /**
       * Sends all statements from $localStorage
       *
       * @returns {deferred.promise|{then, always}}
       */
      TM.sendStatements = function () {
        var deferred = $q.defer();

        if (!TM.get.lrsList.length) {
          deferred.reject('no lrs found');
          return deferred.promise;
        }

        var saved_count = 0;
        var errors = [];
        var successed = [];
        var response_counter = 0;

        angular.forEach(TM.get.lrsList, function (lrs, lrsNum) {
          lrs.saveStatements(
            $localStorage.statements,
            {
              callback: function (err, xhr) {
                if (err !== null) {
                  if (xhr !== null) {
                    var err_msg = "Failed to save statement: " +
                      xhr.responseText + " (" + xhr.status + ")";
                  }

                  console.log("Failed to save statement: ", err);
                  errors.push({
                    lrs: lrs.endpoint,
                    err: err,
                    xhr: xhr
                  })
                } else {
                  successed.push({
                    lrs: lrs.endpoint
                  });
                  saved_count++;
                }
                countResponse()
              }
            }
          );
        });

        function countResponse() {
          response_counter++;
          if (response_counter == TM.get.lrsList.length) {
            if (saved_count > 0) {
              deferred.resolve({
                msg: 'success',
                errList: errors,
                successed: successed
              });
            } else {
              deferred.reject(errors);
            }
          }
        }

        return deferred.promise;
      };
      /**
       * Sends statement
       *
       * @returns {deferred.promise|{then, always}}
       */
      TM.sendStatement = function (stmnt) {
        var deferred = $q.defer();

        if (!TM.get.lrsList.length) {
          deferred.reject('no lrs found');
          return deferred.promise;
        }

        var saved_count = 0;
        var errors = [];
        var successed = [];
        var response_counter = 0;

        angular.forEach(TM.get.lrsList, function (lrs, lrsNum) {
          lrs.saveStatement(
            stmnt,
            {
              callback: function (err, xhr) {
                if (err !== null) {
                  if (xhr !== null) {
                    var err_msg = "Failed to save statement: " +
                      xhr.responseText + " (" + xhr.status + ")";
                  }

                  console.log("Failed to save statement: ", err);
                  errors.push({
                    lrs: lrs.endpoint,
                    err: err,
                    xhr: xhr
                  })
                } else {
                  successed.push({
                    lrs: lrs.endpoint
                  });
                  saved_count++;
                }
                countResponse()
              }
            }
          );
        });

        function countResponse() {
          response_counter++;
          if (response_counter == TM.get.lrsList.length) {
            if (saved_count > 0) {
              deferred.resolve({
                msg: 'success',
                errList: errors,
                successed: successed
              });
            } else {
              deferred.reject(errors);
            }
          }
        }

        return deferred.promise;
      };

      /**
       * Сохранить статус курса
       *
       * Sends all states from $localStorage.states
       *
       * @param key
       * @param val
       * @returns {deferred.promise|{then, always}}
       */

      TM.sendState = function (key, val) {
        var deferred = $q.defer();

        if (!TM.get.lrsList.length) {
          deferred.reject('no lrs found');
          return deferred.promise;
        }

        var saved_count = 0;
        var errors = [];
        var successed = [];
        var response_counter = 0;

        angular.forEach(TM.get.lrsList, function (lrs, lrsNum) {
          lrs.saveState(
            key,
            val,
            {
              agent: TM.get.defaultActor,
              activity: TM.get.courseActivity,
              contentType: "application/json",
              callback: function (err, xhr) {
                if (err !== null) {
                  if (xhr !== null) {
                    var err_msg = "Failed to save state: " +
                      xhr.responseText + " (" + xhr.status + ")";
                  }

                  console.log("Failed to save state: ", err);
                  errors.push({
                    lrs: lrs.endpoint,
                    err: err,
                    xhr: xhr
                  })
                } else {
                  successed.push({
                    lrs: lrs.endpoint
                  });
                  saved_count++;
                }
                countResponse();
              }
            }
          );
        });


        function countResponse() {
          response_counter++;
          if (response_counter == TM.get.lrsList.length) {
            if (saved_count > 0) {
              deferred.resolve({
                msg: 'success',
                errList: errors,
                successed: successed
              });
            } else {
              deferred.reject(errors);
            }
          }
        }

        return deferred.promise;
      };

      /**
       * Get state by key
       * - TODO: last by timestamp from lrsList
       *
       * @param key
       * @returns {deferred.promise|{then, always}}
       */
      TM.getState = function (key) {
        var deferred = $q.defer();

        if (!TM.get.lrsList.length) {
          deferred.reject('no lrs found');
          return deferred.promise;
        }

        var result_states = [];
        var errors = [];

        var response_counter = 0;

        angular.forEach(TM.get.lrsList, function (lrs, lrsNum) {
          lrs.retrieveState(
            key,
            {
              agent: TM.get.defaultActor,
              activity: TM.get.courseActivity,
              contentType: "application/json",
              callback: function (err, result) {
                if (err !== null) {

                  console.log("Failed to get state: ", err);
                  errors.push(err);
                } else {
                  result_states.push(result);
                }

                countResponse();
              }
            }
          );
        });

        function countResponse() {
          response_counter++;
          if (response_counter == TM.get.lrsList.length) {
            if (result_states.length > 0) {
              deferred.resolve({
                msg: 'success',
                results: result_states,
                errList: errors
              });
            } else {
              deferred.reject(errors);
            }
          }
        }

        return deferred.promise;
      };
    }
  ]);

/**
 * Created by ralic on 11.05.2016.
 */
"use strict";

describe('TinCanManager', function () {

  var $localStorage = {};

  var TM;
  var $scope;
  var responseText;
  var errorMsg;

  beforeEach(module('coreApp', function ($provide) {

    $provide.value('$tincanConfig', $tincanConfig);
    $provide.value('$localStorage', $localStorage)
  }));

  beforeEach(inject(function ($injector, _$rootScope_) {
    TM = $injector.get('TinCanManager');
    $scope = _$rootScope_.$new();
  }));

  beforeEach(function () {
    errorMsg = undefined;
    responseText = undefined;
  });

  it('should return lrsList, with only defined LRSes', function () {
    expect(TM.get.lrsList).toBeDefined();
    expect(TM.get.lrsList.length).toEqual(1);
    expect(TM.get.lrsList[0].endpoint).toEqual($tincanConfig.lrs[0].endpoint);
  });

  it('should return defaultActor', function () {
    expect(TM.get.defaultActor).toBeDefined();
  });

  it('should return courseActivity', function () {
    expect(TM.get.courseActivity).toBeDefined();
    expect(TM.get.courseActivity.id).toBeDefined();
    expect(TM.get.courseActivity.definition).toBeDefined();
  });

  it('should return STATES', function () {
    expect(TM.get.STATE).toBeDefined();
    expect(TM.get.STATE.progress).toEqual('progress');
  });

  it('should return VERBS', function () {
    expect(TM.get.VERB).toBeDefined();
    expect(TM.get.VERB.attempted).toBeDefined();
    expect(TM.get.VERB.suspended).toBeDefined();
    expect(TM.get.VERB.completed).toBeDefined();
    expect(TM.get.VERB.exited).toBeDefined();
    expect(TM.get.VERB.initialized).toBeDefined();
    expect(TM.get.VERB.experienced).toBeDefined();
    expect(TM.get.VERB.passed).toBeDefined();
    expect(TM.get.VERB.failed).toBeDefined();
    expect(TM.get.VERB.mastered).toBeDefined();
    expect(TM.get.VERB.voided).toBeDefined();
  });
  describe('LRS Transfering Data', function () {
    var onSuccess;
    var onError;
    var LRStoResolve;
    var LRStoReject;
    var responseText;
    var result_states;
    var errorMsg;

    beforeEach(function () {

      responseText = undefined;
      result_states = undefined;
      errorMsg = undefined;

      onSuccess = function (data) {
        responseText = data.msg;
        result_states = data.results;
        errorMsg = data.errList;
      };

      onError = function (error) {
        errorMsg = error;
      };

      LRStoResolve = {
        saveStatements: function (statements, cfg) {
          cfg.callback(null, null);
        },
        saveState: function (key, val, cfg) {
          cfg.callback(null, null);
        },
        retrieveState: function (key, cfg) {
          cfg.callback(null, null);
        }
      };

      LRStoReject = {
        saveStatements: function (statements, cfg) {
          cfg.callback('error', null);
        },
        saveState: function (key, val, cfg) {
          cfg.callback('error', null);
        },
        retrieveState: function (key, cfg) {
          cfg.callback('error', null);
        }
      };

    });


    describe('SEND statements to LRS', function () {

      beforeEach(function () {
        $localStorage.statements = [1, 2, 3];
      });

      it('should return success', function () {
        spyOn(TM.get, '_getLrsList').and.returnValue([
          LRStoResolve,
          LRStoReject,
          LRStoReject
        ]);

        TM.sendStatements().then(onSuccess, onError);

        $scope.$apply();

        expect(TM.get._getLrsList).toHaveBeenCalled();
        expect(responseText).toEqual('success');
        expect(errorMsg.length).toEqual(2);
      });

      it('should return error', function () {
        spyOn(TM.get, '_getLrsList').and.returnValue([
          LRStoReject,
          LRStoReject,
          LRStoReject
        ]);

        TM.sendStatements().then(onSuccess, onError);

        $scope.$apply();

        expect(TM.get._getLrsList).toHaveBeenCalled();
        expect(errorMsg.length).toEqual(3);
        expect(responseText).toBeUndefined();
      });

    });

    xdescribe('SEND states to LRS', function () {

      beforeEach(function () {
        $localStorage.states = [
          {key: 'a', value: '1'},
          {key: 'b', value: '2'},
          {key: 'c', value: '3'}
        ];
      });

      it('should return success', function () {
        spyOn(TM.get, '_getLrsList').and.returnValue([
          LRStoResolve,
          LRStoReject,
          LRStoResolve
        ]);

        TM.sendState().then(onSuccess, onError);

        $scope.$apply();
        expect(TM.get._getLrsList).toHaveBeenCalled();
        expect(responseText).toEqual('success');
        expect(errorMsg.length).toEqual(1);
      });

      it('should return error', function () {
        spyOn(TM.get, '_getLrsList').and.returnValue([
          LRStoReject,
          LRStoReject,
          LRStoReject
        ]);

        TM.sendState().then(onSuccess, onError);

        $scope.$apply();
        expect(TM.get._getLrsList).toHaveBeenCalled();
        expect(responseText).toBeUndefined();
        expect(errorMsg.length).toEqual(3);
      });
    });

    describe('GET STATE from LRS', function () {
      beforeEach(function () {
        result_states = [];
      });

      it('should get last state from lrsList', function () {
        spyOn(TM.get, '_getLrsList').and.returnValue([
          LRStoResolve,
          LRStoReject,
          LRStoReject
        ]);

        TM.getState().then(onSuccess, onError);

        $scope.$apply();
        expect(TM.get._getLrsList).toHaveBeenCalled();
        expect(responseText).toEqual('success');
        expect(errorMsg.length).toEqual(2);
        expect(result_states.length).toEqual(1);
        //TODO: check for latest
      });

      it('should return error', function () {
        spyOn(TM.get, '_getLrsList').and.returnValue([
          LRStoReject,
          LRStoReject,
          LRStoReject
        ]);

        TM.getState().then(onSuccess, onError);

        $scope.$apply();
        expect(TM.get._getLrsList).toHaveBeenCalled();
        expect(responseText).toBeUndefined();
        expect(errorMsg.length).toEqual(3);
        expect(result_states.length).toEqual(0);
      });
    });
  });
});

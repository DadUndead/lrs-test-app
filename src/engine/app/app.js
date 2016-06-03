'use strict';

var coreApp = angular.module('coreApp',
  [
    'ngAnimate',
    'ngMaterial',
    'ngStorage',
    'hljs'
  ]);

/*
 Не рекомендуется использовать routeProvider, так как ряд СДО включают курс в свои окна и для выхода используют
 навигацию. Такое взаимодейсвтие может привести к негативному опыту.
 */

//Before angular bootstrap ###################################
angular.element(document).ready(preConfig);

function preConfig() {

  var course =
  {
    "course": {
      "title": "Демо Курс",
      "chapters": [
        {
          "id": "1",
          "title": "Название 1 главы",
          "pages": [
            {
              "id": "page_1_0",
              "title": "Название страницы 1_0",
              "components": [
                {
                  "pageTemplateUrl": "templates/page_1_0.html"
                }
              ]
            }
          ]
        }
      ]
    }
  };
  var structure = {
    config: {
      "god_mode": "true",
      "page_block": "false",
      "ex_block": "false",
      "default_localization": 0,
      "localizations": ["ru"],
      "success_score": "100"
    },
    courses: [course],
    course: course
  };
  var tincan_config = {
    "lrs": [
      {
        "id": "scorm_cloud",
        "endpoint": "https://cloud.scorm.com/tc/B89WRZM4E5/",
        "username": "ralict@mail.ru",
        "password": "MegaLearner2016"
      },
      {
        "id": "webtutor",
        "endpoint": "http://dn-srv7:8000/lrs",
        "username": "user1",
        "password": "user1"
      }
    ],
    "defaultActor": {
      "mbox": "mailto:user@usermail.com",
      "name": "Mr User"
    },
    "defaultActivity": {
      "id": "nd/course_id/module_id",
      "title": {
        "ru": "Демо Курс",
        "en-US": "Demo Course"
      },
      "description": {
        "ru": "Описание курса на русском языке",
        "en-US": "Course description in English"
      }
    }
  };

  coreApp.value("$structure", structure);
  coreApp.value("$tincanConfig", tincan_config);
  coreApp.constant("$lmsConnected", false);

  console.log("Bootstrapping AngularJS...");
  angular.bootstrap(document.body, ['coreApp']);
}
/**
 * Created by ralic on 08.05.2016.
 */
"use strict";
var crsMock = {
  title: 'название',
  modals: {},
  templatesConfig: {
    pageCounter: {
      text: 'page'
    }
  },
  chapters: [
    {
      pages: [
        {
          id: 'page000_000',
          components: [
            {
              id: 'comp0',
              type: 'task', //'static', 'dynamic', 'task'
              weight: 1
            }
          ]
        }
      ]
    },
    {
      pages: [
        {
          id: 'page000_001',
          components: [
            {
              id: 'comp1',
              type: 'task', //'static', 'dynamic', 'task'
              weight: 0.5
            }
          ]
        }
      ]
    },
    {
      pages: [{
        id: 'page000_002',
        components: [
          {
            id: 'comp2',
            type: 'task', //'static', 'dynamic', 'task'
            weight: 1
          }
        ]
      }, {
        id: 'page000_003',
        components: [
          {
            id: 'comp3',
            type: 'task', //'static', 'dynamic', 'task'
            weight: 0
          }
        ]
      }]
    }
  ]
};

var $structure = {
  config: {
    "god_mode": true,
    "page_block": false,
    "ex_block": false,
    "default_localization": 0,
    "localizations": ["ru", "en"],
    "success_score": 100
  },
  courses: [
    crsMock,
    crsMock
  ]
};

var defaultProgressMock = {
  position: {
    chapter: 0,
    page: 0,
    component: 0
  },
  scores: [1, 0, 1, 1]
};

var $tincanConfig = {
  "lrs": [
    {
      "id": "scorm_cloud",
      "endpoint": "https://lrs/",
      "username": "ralict@mail.ru",
      "password": "MegaLearner2016"
    },
    {
      "id": "webtutor",
      "endpoint": "",
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
}

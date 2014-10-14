'use strict';

var yoUtils = require('yo-utils');

/* Route defaluts */
var defaults = module.exports.defaults = {
  path: 'server/api/<%= name %>/index.js',
  register: true,
  haystack: 'server/routes.js',
  needle: '// Insert routes below',
  express: 'app',
  url: '/api/<%= pluralizedName %>',
  template: 'default'
};

/* Route options */
module.exports.options = {
  'route-path': {
    desc: 'Path to use for the route',
    type: String
  },
  'route-register': {
    desc: 'Whether or not to register the route',
    type: Boolean
  },
  'route-haystack': {
    desc: 'Path to file that the route will be registered in',
    type: String
  },
  'route-needle': {
    desc: 'String in file to register the route below',
    type: String
  },
  'route-express': {
    desc: 'The variable name of express in the registered file',
    type: String
  },
  'route-url': {
    desc: 'Default url for routes',
    type: String
  },
  'route-template': {
    desc: 'Path to the route template',
    type: String
  }
};

/* Route config prompts */
module.exports.prompts = function(ops, config) {
  var when = yoUtils.app.promptWhen(ops);
  var prompts = [{
    name: 'path',
    message: 'What path should be used for endpoint routes?',
    default: defaults.path,
    when: when('path')
  }, {
    name: 'register',
    message: 'Should your endpoint routes be registered in an express routing file?',
    default: defaults.register,
    type: 'confirm',
    when: when('register')
  }, {
    name: 'haystack',
    message: 'What file should your endpoint routes be registered in?',
    default: defaults.haystack,
    when: when('haystack', 'register')
  }, {
    name: 'needle',
    message: 'What will be the insert point for registering routes?',
    default: defaults.needle,
    when: when('needle', 'register')
  }, {
    name: 'express',
    message: 'What will express be defined as in the routing file?',
    default: defaults.express,
    when: when('express', 'register')
  }];

  if (config) {
    return prompts.concat([{
      name: 'url',
      message: 'What url should be used for endpoints?',
      default: defaults.url,
      when: when('url', 'register')
    }, {
      name: 'template',
      message: 'What template file path would you like to use for routes?',
      default: defaults.template,
      when: when('template')
    }]);
  }

  return prompts;
};

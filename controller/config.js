'use strict';

var yoUtils = require('yo-utils');

/* Controller defaults */
var defaults = module.exports.defaults = {
  path: 'server/api/<%= name %>/<%= name %>.controller.js',
  register: true,
  haystack: 'server/api/<%= name %>/index.js',
  needle: 'var router = require(\'express\').Router();',
  name: '<%= name %>Ctrl',
  template: 'default'
};

/* Controller options */
module.exports.options = {
  'controller-path': {
    desc: 'Path to use for the controller',
    type: String
  },
  'controller-register': {
    desc: 'Whether or not to register the controller',
    type: Boolean
  },
  'controller-haystack': {
    desc: 'Path to file that the controller will be registered in',
    type: String
  },
  'controller-needle': {
    desc: 'String in file to register the controller below',
    type: String
  },
  'controller-name': {
    desc: 'Default variable name for the controller in registered file',
    type: String
  },
  'controller-template': {
    desc: 'Path to the controller template',
    type: String
  }
};

/* Controller config prompts */
module.exports.prompts = function(ops, config) {
  var when = yoUtils.app.promptWhen(ops);
  var prompts = [{
    name: 'path',
    message: 'What path should be used for route controllers?',
    default: defaults.path,
    when: when('path')
  }, {
    name: 'register',
    message: 'Should your route controllers be registered in a routes file?',
    default: defaults.register,
    type: 'confirm',
    when: when('register')
  }, {
    name: 'haystack',
    message: 'What file should your route controllers be registered in?',
    default: defaults.haystack,
    when: when('haystack', 'register')
  }, {
    name: 'needle',
    message: 'What will be the insert point for registering controllers?',
    default: defaults.needle,
    when: when('needle', 'register')
  }];

  if (config) {
    return prompts.concat([{
      name: 'name',
      message: 'What variable name should route controllers be registered as?',
      default: defaults.name,
      when: when('name', 'register')
    }, {
      name: 'template',
      message: 'What template file path would you like to use for controllers?',
      default: defaults.template,
      when: when('template')
    }]);
  }

  return prompts;
};

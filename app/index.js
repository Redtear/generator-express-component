'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var defaults;

var ExpressComponentGenerator = module.exports = yeoman.generators.Base.extend({

  initializing: function() {
    if (!this.options['skip-message']) {
      console.log(chalk.magenta('Express goodies brought to you by generator-express-component.\n'));
    }

    defaults = {
      endpoint: {
        'route': 'server/api/<%= name %>/index.js',
        'register-route': 'server/routes.js',
        'routes-needle': '// Insert routes below',
        'controller': 'server/api/<%= name %>/<%= name %>.controller.js',
        'route-url': '/api/<%= name %>',
        'pluralize-routes': true,

        'socket': 'server/api/<%= name %>/<%= name %>.socket.js',
        'insert-sockets': 'server/config/socketio.js',
        'sockets-needle': '// Insert sockets below'
      }
    };
  },

  prompting: {
    endpoint: function() {
      var cb = this.async();
      var ops = this.options;

      var prompts = [{
        name: 'route',
        message: 'What path should be used for endpoint routes'
      }, {
        name: 'register-route',
        message: 'What file should your endpoint routes be registered in'
      }, {
        name: 'routes-needle',
        message: 'What will be the insert point for registering routes'
      }, {
        name: 'controller',
        message: 'What path should be used for endpoint controllers'
      }, {
        name: 'route-url',
        message: 'What url should be used for endpoints'
      }, {
        type: 'confirm',
        name: 'pluralize-routes',
        message: 'Should endpoint names be pluralized'
      }, {
        name: 'socket',
        message: 'What path should be used for endpoint sockets'
      }, {
        name: 'insert-sockets',
        message: 'What file should your endpoint sockets be registered in'
      }, {
        name: 'sockets-needle',
        message: 'What will be the insert point for registering sockets'
      }];

      /* Set prompt defaults and when conditions */
      for (var i = 0, promptsLength = prompts.length; i < promptsLength; i++) {
        var prompt = prompts[i];
        prompt.default = defaults.endpoint[prompt.name];
        if (!prompt.hasOwnProperty('type')) {
          prompt.type = 'input';
        }
        if (!prompt.hasOwnProperty('when')) {
          prompt.when = (function(op) {
            return function(answers) {
              answers[op] = ops['endpoint-' + op];
              return ops.endpoint !== false && typeof answers[op] === 'undefined';
            };
          })(prompt.name);
        }
      }

      this.prompt(prompts, function(answers) {
        this.endpointConfig = this._.assign(defaults.endpoint, answers);
        cb();
      }.bind(this));
    }
  },

  configuring: {
    saveConfig: function() {
      if (!this.options['skip-message']) {
        console.log(chalk.magenta('Initializing yo-rc.json configuration.\n'));
      }

      this.config.defaults({
        endpoint: this.endpointConfig
      });
    }
  }
});

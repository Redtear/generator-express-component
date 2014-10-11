'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var endpointCfg = require('../endpoint/config');
var defaults;

var ExpressComponentGenerator = module.exports = yeoman.generators.Base.extend({

  initializing: function() {
    if (!this.options['skip-message']) {
      console.log(chalk.magenta('Express goodies brought to you by generator-express-component.\n'));
    }

    defaults = {
      endpoint: endpointCfg.defaults
    };
  },

  prompting: {
    endpoint: function() {
      var cb = this.async();
      var ops = this.options;

      var prompts = endpointCfg.prompts(when, whenRoute);

      /* Set prompt defaults */
      for (var i = 0, promptsLength = prompts.length; i < promptsLength; i++) {
        var prompt = prompts[i];
        prompt.default = defaults.endpoint[prompt.name];
      }

      this.prompt(prompts, function(answers) {
        this.endpointConfig = answers;
        cb();
      }.bind(this));


      /* when */
      function when(op) {
        return function(answers) {
          answers[op] = ops['endpoint-' + op];
          return ops.endpoint !== false && typeof answers[op] === 'undefined';
        }
      }

      /* whenRoute */
      function whenRoute(op) {
        return function(answers) {
          return when(op)(answers) && ops['endpoint-route'] !== false;
        }
      }
    }
  },

  configuring: {
    saveConfig: function() {
      if (!this.options['skip-message']) {
        console.log(chalk.magenta('Initializing yo-rc.json configuration.\n'));
      }

      if (this.options['force-config']) {
        this.config.set('endpoint', this.endpointConfig);
        this.config.forceSave();
      } else {
        this.config.defaults({
          endpoint: this.endpointConfig
        });
      }
    }
  }
});

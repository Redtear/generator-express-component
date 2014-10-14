'use strict';
var util = require('util');
var path = require('path');
var yoUtils = require('yo-utils');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _;

/* sub gen configs */
var routeCfg = require('../route/config');
var controllerCfg = require('../controller/config');
var config = {};

var ExpressComponentGenerator = module.exports = yeoman.generators.Base.extend({

  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);

    // add usage options
    this.option('skip-message', {
      desc: 'Suppress generator messages',
      defaults: false
    });
    this.option('force-config', {
      desc: 'Force overwritting of previous config values',
      defaults: false
    });
    var uds = ['', 'route', 'controller'];
    for (var i = 0, udsLength = uds.length; i < udsLength; i++) {
      var ud = uds[i];
      this.option((ud ? ud + '-' : '') + 'use-defaults', {
        desc: 'Skip all ' + (ud ? ud + ' ' : '') + 'prompts and use defaults'
      });
    }
    for (var opt in routeCfg.options) {
      this.option(opt, routeCfg.options[opt]);
    }
    for (var opt in controllerCfg.options) {
      this.option(opt, controllerCfg.options[opt]);
    }
  },

  initializing: function() {
    if (!this.options['skip-message']) {
      console.log(chalk.magenta('Express goodies brought to you by generator-express-component.\n'));
    }

    /* define lodash */
    _ = this._;

    /* generator defaults */
    this.defaults = {
      route: routeCfg.defaults,
      controller: controllerCfg.defaults
    }

    /* check for "use-defaults" */
    this.useDefaults = function(gen) {
      return (this.options['use-defaults'] || this.options[gen + '-use-defaults']);
    };
  },

  prompting: {

    routeCfg: function() {
      if (this.useDefaults('route')) {
        config.route = this.defaults.route;
      } else {
        var done = this.async();
        var ops = yoUtils.app.pluckOps(/^route-/, this.options);
        var prompts = routeCfg.prompts(ops, true);

        this.prompt(prompts, function(answers) {
          config.route = _.extend(ops, answers);
          done();
        });
      }
    },

    controllerCfg: function() {
      if (this.useDefaults('controller')) {
        config.controller = this.defaults.controller;
      } else {
        var done = this.async();
        var ops = yoUtils.app.pluckOps(/^controller-/, this.options);
        var prompts = controllerCfg.prompts(ops, true);

        this.prompt(prompts, function(answers) {
          config.controller = _.extend(ops, answers);
          done();
        });
      }
    }
  },

  configuring: {
    saveConfig: function() {
      if (!this.options['skip-message']) {
        console.log(chalk.magenta('Initializing yo-rc.json configuration.\n'));
      }

      if (this.options['force-config']) {
        for (var k in config) {
          this.config.set(k, config[k]);
        }
        this.config.forceSave();
      } else {
        this.config.defaults(config);
      }
    }
  }
});

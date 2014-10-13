'use strict';
var path = require('path');
var yoUtils = require('yo-utils');
var chalk = require('chalk');
var controllerCfg = require('./config');
var _;


var EndpointGenerator = yoUtils.NamedBase.extend({

  constructor: function() {
    yoUtils.NamedBase.apply(this, arguments);

    // add usage options
    for (var opt in controllerCfg.options) {
      this.option(opt, controllerCfg.options[opt]);
    }

    _ = this._;
  },

  /* Init method */
  initializing: function() {
    if (!this.options['skip-message']) {
      console.log(chalk.magenta('Express controllers brought to you by generator-express-component.\n'));
    }

    // config defaults
    this.option('skip-message', {
      desc: 'Suppress generator messages',
      defaults: false
    });
    this.defaults = controllerCfg.defaults;
  },

  /* Prompting priority methods */
  prompting: {
    subGenCfg: function() {
      var done = this.async();
      var ops = yoUtils.app.pluckOps(/^controller-/, this.options);
      var cfg = this.config.get('controller') || {};
      ops = _.extend(cfg, ops);

      var prompts = controllerCfg.prompts(ops);

      this.prompt(prompts, function(answers) {
        this.ops = _.extend(ops, answers);
        done();
      }.bind(this));
    },

    instancePrompts: function() {
      var done = this.async();
      var name = this.name;
      var ops = this.ops;
      var nameTpl = this.ops.name || this.defaults.name;

      var prompts = [{
        name: 'name',
        message: 'What will the variable name of your controller be?',
        default: this.engine(nameTpl, this),
        when: yoUtils.app.promptWhen(ops)('name', 'register')
      }];

      this.prompt(prompts, function (answers) {
        this.ops.name = answers.name || controllerCfg.defaults.name;
        done();
      }.bind(this));
    }
  },

  configuring: {
    templateOps: function() {
      for (var op in this.ops) {
        var opVal = this.ops[op];
        if (typeof opVal === 'string') {
          this.ops[op] = this.engine(opVal, this);
        }
      }
    }
  },

  /* Writing priority methods */
  writing: {
    // add controller endpoint to express route
    registerEndpoint: function() {
      if (this.ops.register) {
        var ctrlName = this.ops.name;
        var regControllerFile = this.ops.haystack;
        var controllerFile = this.ops.path;
        var relativeController = yoUtils.templating.relativePathTo(regControllerFile, controllerFile, true);
        yoUtils.templating.rewriteFile({
          file: regControllerFile,
          needle: this.ops.needle,
          splicable: [
            "var " + ctrlName + " = require(\'" + relativeController + "\'));"
          ]
        });
      }
    },

    // add new controller file
    createFiles: function() {
      var tPath;
      if (!this.ops.template || this.ops.template.toLowerCase() === 'default') {
        tPath = path.join(__dirname, './templates/controller.js');
      } else {
        tPath = path.relative(this.sourceRoot(), this.ops.template);
      }

      this.template(tPath, this.ops.path, this);
    }
  }

});

module.exports = EndpointGenerator;

'use strict';
var path = require('path');
var yoUtils = require('yo-utils');
var chalk = require('chalk');
var routeCfg = require('./config');
var _;


var EndpointGenerator = yoUtils.NamedBase.extend({

  constructor: function() {
    yoUtils.NamedBase.apply(this, arguments);

    // add usage options
    for (var opt in routeCfg.options) {
      this.option(opt, routeCfg.options[opt]);
    }

    _ = this._;
  },

  /* Init method */
  initializing: function() {
    if (!this.options['skip-message']) {
      console.log(chalk.magenta('Express routes brought to you by generator-express-component.\n'));
    }

    // config defaults
    this.option('skip-message', {
      desc: 'Suppress generator messages',
      defaults: false
    });
    this.defaults = routeCfg.defaults;
  },

  /* Prompting priority methods */
  prompting: {
    subGenCfg: function() {
      var done = this.async();
      var ops = yoUtils.app.pluckOps(/^route-/, this.options);
      var cfg = this.config.get('route') || {};
      ops = _.extend(cfg, ops);

      var prompts = routeCfg.prompts(ops);

      this.prompt(prompts, function(answers) {
        this.ops = _.extend(ops, answers);
        done();
      }.bind(this));
    },

    instancePrompts: function() {
      var done = this.async();
      var ops = this.ops;
      var urlTpl = this.ops.url || this.defaults.url;

      var prompts = [{
        name: 'route',
        message: 'What will the url of your endpoint be?',
        default: this.engine(urlTpl, this),
        when: yoUtils.app.promptWhen(ops)('route')
      }];

      this.prompt(prompts, function (answers) {
        if(answers.route.charAt(0) !== '/') {
          answers.route = '/' + answers.route;
        }
        this.url = answers.route;
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
    // add route endpoint to express app
    registerEndpoint: function() {
      if (this.ops.register) {
        var regRouteFile = this.ops.haystack;
        var routeFile = this.ops.path;
        var relativeRoute = yoUtils.templating.relativePathTo(regRouteFile, routeFile, true);
        yoUtils.templating.rewriteFile({
          file: regRouteFile,
          needle: this.ops.needle,
          splicable: [
            "app.use(\'" + this.url +"\', require(\'" + relativeRoute + "\'));"
          ]
        });
      }
    },

    // add new route file
    createFiles: function() {
      var tPath;
      if (!this.ops.template || this.ops.template.toLowerCase() === 'default') {
        tPath = path.join(__dirname, './templates/route.js');
      } else {
        tPath = path.relative(this.sourceRoot(), this.ops.template);
      }

      this.template(tPath, this.ops.path, this);
    }
  }

});

module.exports = EndpointGenerator;

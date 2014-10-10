'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var yoUtils = require('yo-utils');
var chalk = require('chalk');
var pluralize = require('pluralize');
var endpointCfg = require('./config');
var defaults;


var EndpointGenerator = yoUtils.NamedBase.extend({

  constructor: function() {
    yoUtils.NamedBase.apply(this, arguments);
  },

  /* Init method */
  initializing: function() {
    if (!this.options['skip-message']) {
      console.log(chalk.magenta('Express endpoints brought to you by generator-express-component.\n'));
    }
    // instance options
    this.instanceOps = {};

    // private properties
    this.trimReqFile = /((\/|\\)index\.js|\.js)$/;

    // prompt defaults
    defaults = {
      endpoint: endpointCfg.defaults
    };
  },

  /* Prompting priority methods */
  prompting: {
    subGenCfg: function() {
      var cb = this.async();
      var ops = this.options;
      var cfg = this.config;
      var urlIndex;

      var prompts = endpointCfg.prompts(when, whenRoute);

      /* Set prompt defaults and flag route-url prompt */
      for (var i = 0, promptsLength = prompts.length; i < promptsLength; i++) {
        var prompt = prompts[i];
        if (prompt.name === 'route-url') {
          urlIndex = i;
        } else {
          prompt.default = defaults.endpoint[prompt.name];
        }
      }

      // remove prompt for route-url, will be handled below
      prompts.splice(urlIndex, 1);

      this.prompt(prompts, function(answers) {
        this.instanceOps = answers;
        cb();
      }.bind(this));


      /* when */
      function when(op) {
        return function(answers) {
          answers[op] = opsCfg(ops, op);
          return typeof answers[op] === 'undefined';
        }
      }

      /* whenRoute */
      function whenRoute(op) {
        return function(answers) {
          return when(op)(answers) && opsCfg(ops, 'route') !== false;
        }
      }

      /* ops or cfg */
      function opsCfg(ops, op) {
        var cfgVal = (typeof cfg.get('endpoint') !== 'undefined') ?
          cfg.get('endpoint')[op] : undefined;
        return (typeof ops['endpoint-' + op] !== 'undefined') ?
          ops['endpoint-' + op] : cfgVal;
      }
    },

    instancePrompts: function() {
      var done = this.async();
      var name = this.name;
      var ops = this.options;
      var cfg = this.config.get('endpoint');
      var url;

      if (cfg && cfg['route-url']) {
        url = cfg['route-url'];
      } else {
        url = defaults.endpoint['route-url'];
      }

      // pluralization defaults to true for backwards compat
      if (this.instanceOps['pluralize-routes'] !== false) {
        name = pluralize.plural(name);
      }

      var prompts = [{
        name: 'type',
        message: 'What type of endpoint will this be?',
        type: 'list',
        choices: ['Basic', 'CRUD'],
        when: whenNotOpt('type')
      }, {
        name: 'route',
        message: 'What will the url of your endpoint be?',
        default: this.engine(url, {name: name}),
        when: whenNotOpt('route')
      }];

      this.prompt(prompts, function (answers) {
        if(answers.route.charAt(0) !== '/') {
          answers.route = '/' + answers.route;
        }
        this.endpointType = answers.type
        this.route = answers.route;
        done();
      }.bind(this));

      /* whenNotOpt */
      function whenNotOpt(op) {
        return function(answers) {
          answers[op] = ops['endpoint-' + op];
          return typeof answers[op] === 'undefined';
        }
      }
    }
  },

  configuring: {
    templatePaths: function() {
      for (var op in this.instanceOps) {
        var opVal = this.instanceOps[op];
        if (typeof opVal === 'string') {
          this.instanceOps[op] = this.engine(opVal, {name: this.name});
        }
      }
    }
  },

  /* Writing priority methods */
  writing: {
    // add route and socket endpoint to main express app
    registerEndpoint: function() {
      var regRouteFile = this.instanceOps['register-route'];
      if (regRouteFile) {
        var regRoutePath = regRouteFile.replace(path.basename(regRouteFile), '');
        var routeFile = this.instanceOps.route;
        var relativeRoute = path.relative(regRoutePath, routeFile)
          .replace(this.trimReqFile,'');
        var routeConfig = {
          file: regRouteFile,
          needle: this.instanceOps['routes-needle'],
          splicable: [
            "app.use(\'" + this.route +"\', require(\'./" + relativeRoute + "\'));"
          ]
        };
        yoUtils.templating.rewriteFile(routeConfig);
      }
    },

    // add new endpoint files
    createFiles: function() {
      var tPath = path.join(__dirname, './templates') + '/';
      var routeFile = this.instanceOps.route;
      var ctrlFile = this.instanceOps.controller;

      if (routeFile) {
        if (ctrlFile) {
          var routePath = routeFile.replace(path.basename(routeFile), '');
          this.relativeCtrlPath = './' + path.relative(routePath, ctrlFile)
            .replace(this.trimReqFile, '');
        }
        this.template(tPath + 'route.js', routeFile, this);
      }
      if (ctrlFile) {
        this.template(tPath + 'controller.js', ctrlFile, this);
      }
    }
  }

});

module.exports = EndpointGenerator;

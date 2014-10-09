'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var yoUtils = require('yo-utils');
var chalk = require('chalk');
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

      var prompts = endpointCfg.prompts(when, whenRoute, whenSocket);

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

      /* whenSocket */
      function whenSocket(op) {
        return function(answers) {
          return when(op)(answers) && opsCfg(ops, 'socket') !== false;
        }
      }

      /* ops or cfg */
      function opsCfg(ops, op) {
        return (typeof ops['endpoint-' + op] !== 'undefined') ?
          ops['endpoint-' + op] : cfg.get('endpoint')[op];
      }
    },

    askForUrl: function() {
      var done = this.async();
      var name = this.name;

      var base = this.config.get('routesBase') || '/api/';
      if(base.charAt(base.length-1) !== '/') {
        base = base + '/';
      }

      // pluralization defaults to true for backwards compat
      if (this.config.get('pluralizeRoutes') !== false) {
        name = name + 's';
      }

      var prompts = [
        {
          name: 'route',
          message: 'What will the url of your endpoint to be?',
          default: base + name
        },

      ];

      this.prompt(prompts, function (props) {
        if(props.route.charAt(0) !== '/') {
          props.route = '/' + props.route;
        }

        this.route = props.route;
        done();
      }.bind(this));
    }
  },

  /* Writing priority methods */
  writing: {
    // add route and socket endpoint to main express app
    registerEndpoint: function() {
      if(this.config.get('insertRoutes')) {
        var routeConfig = {
          file: this.config.get('registerRoutesFile'),
          needle: this.config.get('routesNeedle'),
          splicable: [
            "app.use(\'" + this.route +"\', require(\'./api/" + this.name + "\'));"
          ]
        };
        yoUtils.templating.rewriteFile(routeConfig);
      }

      if(this.filters.socketio && this.config.get('insertSockets')) {
        var socketConfig = {
          file: this.config.get('registerSocketsFile'),
          needle: this.config.get('socketsNeedle'),
          splicable: [
            "require(\'../api/" + this.name + '/' + this.name + ".socket\').register(socket);"
          ]
        };
        yoUtils.templating.rewriteFile(socketConfig);
      }
    },

    // add new endpoint files
    createFiles: function() {
      var dest = this.config.get('endpointDirectory') || 'server/api/' + this.name;
      this.sourceRoot(path.join(__dirname, './templates'));
      yoUtils.templating.processDirectory(this, '.', dest);
    }
  }

});

module.exports = EndpointGenerator;

'use strict';
var path = require('path');
var util = require('util');
var yoUtils = require('yo-utils');


var EndpointGenerator = module.exports = yoUtils.base.extend({

  /* Prompting priority methods */
  prompting: {
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
        }
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

      if (this.filters.socketio) {
        if(this.config.get('insertSockets')) {
          var socketConfig = {
            file: this.config.get('registerSocketsFile'),
            needle: this.config.get('socketsNeedle'),
            splicable: [
              "require(\'../api/" + this.name + '/' + this.name + ".socket\').register(socket);"
            ]
          };
          yoUtils.templating.rewriteFile(socketConfig);
        }
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

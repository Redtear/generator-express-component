'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var ExpressComponentGenerator = module.exports = yeoman.generators.Base.extend({

  info: function() {
    if (!this.options['skip-message']) {
      console.log(chalk.magenta('Express goodies brought to you by generator-express-component.\n'));
      console.log(chalk.magenta('Initializing yo-rc.json configuration.\n'));
    }
  },

  saveConfig: function() {
    this.config.defaults({
      'insertRoutes': this.options.insertRoutes || true,
      'registerRoutesFile': this.options.registerRoutesFile || 'server/routes.js',
      'routesNeedle': this.options.routesNeedle || '// Insert routes below',

      'routesBase': this.options.routesBase || '/api/',
      'pluralizeRoutes': this.options.pluralizeRoutes || true,

      'insertSockets': this.options.insertSockets || true,
      'registerSocketsFile': this.options.registerSocketsFile || 'server/config/socketio.js',
      'socketsNeedle': this.options.socketsNeedle || '// Insert sockets below',

      'filters': this.options.filters || ['socketio']
    });
  }
});

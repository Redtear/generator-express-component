'use strict';

var yoUtils = require('yo-utils');
var chalk = require('chalk');


var EndpointGenerator = yoUtils.NamedBase.extend({

  constructor: function() {
    yoUtils.NamedBase.apply(this, arguments);

    this.hookFor('express-component:route', {
      options: {
        options: this._.defaults({'skip-message': true}, this.options)
      }
    })
    this.hookFor('express-component:controller', {
      options: {
        options: this._.defaults({'skip-message': true}, this.options)
      }
    });
  },

  /* Init method */
  initializing: function() {
    if (!this.options['skip-message']) {
      console.log(chalk.magenta('Express endpoints brought to you by generator-express-component.\n'));
    }
  }

});

module.exports = EndpointGenerator;

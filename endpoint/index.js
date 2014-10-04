'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var EndpointGenerator = module.exports = function EndpointGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  console.log('You called the endpoint subgenerator with the argument ' + this.name + '.');
};

util.inherits(EndpointGenerator, yeoman.generators.NamedBase);

EndpointGenerator.prototype.files = function files() {
  this.copy('somefile.js', 'somefile.js');
};

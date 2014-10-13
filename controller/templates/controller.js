'use strict';

// <%= classedName %> controller
exports.index = function(req, res) {
  res.send('<h1><%= name %> endpoint</h1>');
};

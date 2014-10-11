'use strict';

// Gets list of <%= name %>s.
exports.index = function(req, res) {
  // res.json(<%= name %>s)
};<% if(endpointType === 'crud') { %>

// Gets a single <%= name %>.
exports.show = function(req, res) {
  // res.json(<%= name %>);
};

// Creates a new <%= name %>.
exports.create = function(req, res) {
  // res.status(201).json(new<%= classedName %>);
};

// Updates an existing <%= name %> in the DB.
exports.update = function(req, res) {
  // res.json(updated<%= classedName %>);
};

// Deletes a <%= name %>.
exports.destroy = function(req, res) {
  // res.status(204).end();
};<% } %>

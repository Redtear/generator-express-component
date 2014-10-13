'use strict';

var router = require('express').Router();

router.get('/', function(req, res) {
  res.send('<h1><%= pluralizedName %> route</h1>');
});

module.exports = router;

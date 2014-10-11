'use strict';

var express = require('express');<% if (relativeCtrlPath) { %>
var controller = require('<%= relativeCtrlPath %>');<% } %>

var router = express.Router();<% if (relativeCtrlPath) { %>

router.get('/', controller.index);<% if(endpointType === 'crud') { %>
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);<% } } %>

module.exports = router;

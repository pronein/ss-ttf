const express = require('express');
const router = express.Router();
const controller = require('../api/controllers/permissions.controller');
const passport = require('passport');
const log = require('../config/logger');
const isAuthorized = require('../config/passport').isAuthorized;

router.param('id', function(req, res, next, id){
  log.debug('router.params.id: ' + id);
  next();
});

router.use(function(req, res, next) {
  req.isApi = true;
  next();
});

router.post('/', isAuthorized('permission_admin'), controller.createPermission);
router.put('/:id', isAuthorized('permission_update'), controller.updatePermission);
router.get('/:id', isAuthorized('permission_read'), controller.getById);

module.exports = router;

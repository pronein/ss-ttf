'use strict';

const router = require('express').Router();
const controller = require('../api/controllers/roles.controller');
const log = require('../config/logger');
const isAuthorized = require('../config/passport').isAuthorized;

router.param('id', function (req, res, next, id) {
  log.debug('router.params.id: ' + id);
  return next();
});

router.use(function (req, res, next) {
  req.isApi = true;
  return next();
});

router.post('/', isAuthorized('role_admin'), controller.create);

router.put('/:id', isAuthorized('role_admin'), controller.update);

router.get('/', isAuthorized('role_admin'), controller.getAll);
router.get('/:id', isAuthorized('role_admin'), controller.getById);

router.delete('/:id', isAuthorized('role_admin'), controller.delete);

module.exports = router;

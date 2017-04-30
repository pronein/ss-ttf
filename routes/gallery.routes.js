'use strict';

const router = require('express').Router();
const controller = require('../api/controllers/galleries.controller');
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

router.post('/', controller.create);

router.put('/:id', controller.update);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

router.delete('/:id', isAuthorized('gallery_admin'), controller.delete);

module.exports = router;
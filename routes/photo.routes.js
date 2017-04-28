'use strict';

const router = require('express').Router();
const controller = require('../api/controllers/photos.controller');
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

router.post('/', isAuthorized('photo_admin'), controller.create);
router.post('/upload', controller.upload);

router.put('/:id', isAuthorized('photo_admin'), controller.update);

router.get('/', controller.getAll);
router.get('/:id', isAuthorized('photo_admin'), controller.getById);

router.delete('/:id', isAuthorized('photo_admin'), controller.delete);

module.exports = router;
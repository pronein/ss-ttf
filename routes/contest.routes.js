'use strict';

const router = require('express').Router();
const controller = require('../api/controllers/contests.controller');
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

router.put('/:id', isAuthorized(), controller.update);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/:id/scores', controller.getContestScores);

router.delete('/:id', controller.delete);

module.exports = router;
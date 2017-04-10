'use strict';

const router = require('express').Router();
const controller = require('../api/controllers/users.controller');
const passport = require('passport');
const log = require('../config/logger');
const generateToken = require('../config/passport').generateToken;
const isAuthorized = require('../config/passport').isAuthorized;

router.param('id', function(req, res, next, id){
  log.debug('router.params.id: ' + id);
  return next();
});

router.use(function(req, res, next) {
  req.isApi = true;
  return next();
});

router.post('/', controller.create);

router.get('/', isAuthorized('user_admin'), controller.getAll);
router.get('/token', passport.authenticate('basic', {session: false}), generateToken, controller.token);
router.get('/me', isAuthorized(), controller.getMe);
router.get('/:id', isAuthorized(), controller.getById);

router.put('/me', isAuthorized(), controller.update);
router.put('/:id', isAuthorized('user_admin'), controller.update);

router.delete('/:id', isAuthorized('user_admin'), controller.delete);

module.exports = router;

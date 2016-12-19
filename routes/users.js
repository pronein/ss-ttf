const express = require('express');
const router = express.Router();
const controller = require('../api/controllers/users.controller');
const passport = require('passport');
const log = require('../config/logger');
const generateToken = require('../config/passport').generateToken;
const isAuthorized = require('../config/passport').isAuthorized;

router.param('id', function(req, res, next, id){
  log.info('router.params.id: ' + id);
  next();
});

router.use(function(req, res, next) {
  req.isApi = true;
  next();
});

router.post('/', controller.register);
router.get('/token', passport.authenticate('basic', {session: false}), generateToken, controller.token);
router.get('/:id', isAuthorized(), controller.getById);

module.exports = router;

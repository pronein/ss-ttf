const express = require('express');
const router = express.Router();
const controller = require('../api/controllers/users.controller');
const passport = require('passport');
const log = require('../config/logger');

router.param('id', function(req, res, next, id){
  log.info('router.params.id: ' + id);
  next();
});

router.use(function(req, res, next) {
  req.isApi = true;
  next();
});

router.post('/', controller.register);
router.get('/token', passport.authenticate('basic', {session: false}), controller.token);
router.get('/:id', controller.getById);

module.exports = router;

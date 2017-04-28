'use strict';

const router = require('express').Router();
const controller = require('../api/controllers/checklists.controller.js');
const log = require('../config/logger');
const isAuthorized = require('../config/passport').isAuthorized;

router.param('id', function (req, res, next, id) {
  log.debug('router.params.id: ' + id);
  return next();
});

router.param('itemId', function (req, res, next, itemId) {
  log.debug('router.params.itemId: ' + itemId);
  return next();
});

router.use(function (req, res, next) {
  req.isApi = true;
  return next();
});

router.post('/', isAuthorized(), controller.create);
router.post('/:id/item', isAuthorized(), controller.createItem);

router.put('/:id', isAuthorized(), controller.update);
router.put('/:id/item/:itemId', isAuthorized(), controller.updateItem);

router.get('/', isAuthorized(), controller.getAll);
router.get('/:id', isAuthorized(), controller.getById);
router.get('/:id/item', isAuthorized(), controller.getAllItems);
router.get('/:id/item/:itemId', isAuthorized(), controller.getItemById);

router.delete('/:id', isAuthorized(), controller.delete);
router.delete('/:id/item/:itemId', isAuthorized(), controller.deleteItem);

module.exports = router;
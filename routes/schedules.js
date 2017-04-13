'use strict';

const router = require('express').Router();
const controller = require('../api/controllers/schedules.controller.js');
const log = require('../config/logger');
const isAuthorized = require('../config/passport').isAuthorized;

router.param('id', function (req, res, next, id) {
  log.debug('router.params.id: ' + id);
  return next();
});

router.param('eventId', function (req, res, next, eventId) {
  log.debug('router.params.eventId: ' + eventId);
  return next();
});

router.param('mealId', function (req, res, next, mealId) {
  log.debug('router.params.mealId: ' + mealId);
  return next();
});

router.use(function (req, res, next) {
  req.isApi = true;
  return next();
});

router.post('/', controller.create);
router.post('/:id/event', controller.createEvent);
router.post('/:id/meal', controller.createMeal);

router.put('/:id', controller.update);
router.put('/:id/event/:eventId', controller.updateEvent);
router.put('/:id/meal/:mealId', controller.updateMeal);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/:id/event', controller.getAllEvents);
router.get('/:id/event/:eventId', controller.getEventById);
router.get('/:id/meal', controller.getAllMeals);
router.get('/:id/meal/:mealId', controller.getMealById);

router.delete('/:id', controller.delete);
router.delete('/:id/event/:eventId', controller.deleteEvent);
router.delete('/:id/meal/:mealId', controller.deleteMeal);

module.exports = router;
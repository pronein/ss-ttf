'use strict';

const models = require('../../models/models');
const log = require('../../config/logger');

module.exports = {
  getAll: getAllSchedules,
  getById: getScheduleById,
  getAllEvents: getAllScheduledEvents,
  getEventById: getScheduledEventById,
  getAllMeals: getAllScheduledMeals,
  getMealById: getScheduledMealById,
  create: createSchedule,
  createEvent: createScheduledEvent,
  createMeal: createScheduledMeal,
  update: updateSchedule,
  updateEvent: updateScheduledEvent,
  updateMeal: updateScheduledMeal,
  'delete': deleteSchedule,
  deleteEvent: deleteScheduledEvent,
  deleteMeal: deleteScheduledMeal
};

function getAllSchedules(req, res, next) {
  const tripId = req.query.trip;

  const filter = {};
  if (tripId)
    filter.associatedTrip = tripId;

  models.Schedule.find(filter, function (err, schedules) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!schedules || !schedules.length)
      return res.sendStatus(404);

    return res.status(200).json({schedules: schedules});
  });
}

function getScheduleById(req, res, next) {
  const scheduleId = req.params.id;

  models.Schedule.findByScheduleId(scheduleId, function (err, schedule) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!schedule)
      return res.sendStatus(404);

    return res.status(200).json({schedule: schedule});
  });
}

function getAllScheduledEvents(req, res, next) {
  const scheduleId = req.params.id;

  models.Schedule.findByScheduleId(scheduleId, function (err, schedule) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!schedule || !schedule.events || !schedule.events.length)
      return res.sendStatus(404);

    return res.status(200).json({events: schedule.events});
  });
}

function getScheduledEventById(req, res, next) {
  const scheduleId = req.params.id;
  const eventId = req.params.eventId;

  models.Schedule.findByScheduleId(scheduleId, function (err, schedule) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!schedule)
      return res.sendStatus(404);

    const events = schedule.events.filter(function (event) {
      return event._id.toString() === eventId;
    });

    if (!events.length)
      return res.sendStatus(404);

    return res.status(200).json({event: events[0]});
  });
}

function getAllScheduledMeals(req, res, next) {
  const scheduleId = req.params.id;

  models.Schedule.findByScheduleId(scheduleId, function (err, schedule) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!schedule || !schedule.meals || !schedule.meals.length)
      return res.sendStatus(404);

    return res.status(200).json({meals: schedule.meals});
  });
}

function getScheduledMealById(req, res, next) {
  const scheduleId = req.params.id;
  const mealId = req.params.mealId;

  models.Schedule.findByScheduleId(scheduleId, function (err, schedule) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!schedule)
      return res.sendStatus(404);

    const meals = schedule.meals.filter(function (meal) {
      return meal._id.toString() === mealId;
    });

    if (!meals.length)
      return res.sendStatus(404);

    return res.status(200).json({meal: meals[0]});
  });
}

function createSchedule(req, res, next) {
  const requestedSchedule = new models.Schedule(req.body);

  requestedSchedule.save(function (err, schedule) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    return res.status(201).json({id: schedule._id});
  });
}

function createScheduledEvent(req, res, next) {
  const scheduleId = req.params.id;
  const requestedEvent = new models.Event(req.body);

  models.Schedule.findByScheduleId(scheduleId, function (err, schedule) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!schedule)
      return res.sendStatus(404);

    schedule.events.push(requestedEvent);
    schedule.save(function (err, schedule) {
      if (err) {
        log.error({err: err});
        return next(err);
      }

      return res.status(201).json({id: schedule.events[schedule.events.length - 1]._id});
    });
  });
}

function createScheduledMeal(req, res, next) {
  const scheduleId = req.params.id;
  const requestedMeal = new models.Meal(req.body);

  models.Schedule.findByScheduleId(scheduleId, function (err, schedule) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!schedule)
      return res.sendStatus(404);

    schedule.meals.push(requestedMeal);
    schedule.save(function (err, schedule) {
      if (err) {
        log.error({err: err});
        return next(err);
      }

      return res.status(201).json({id: schedule.meals[schedule.meals.length - 1]._id});
    });
  });
}

function updateSchedule(req, res, next) {
  const scheduleId = req.params.id;
  const schedule = req.body;
  const options = {new: true, runValidators: true};

  models.Schedule.findByIdAndUpdate(scheduleId, schedule, options, function (err, updatedSchedule) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!updatedSchedule)
      return res.sendStatus(404);

    return res.status(200).json({schedule: updatedSchedule});
  });
}

function updateScheduledEvent(req, res, next) {
  const scheduleId = req.params.id;
  const eventId = req.params.eventId;
  const event = req.body;

  models.Schedule.findByScheduleId(scheduleId, function (err, schedule) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!schedule)
      return res.sendStatus(404);

    var foundEvents = schedule.events.filter(function (event) {
      return event._id.toString() === eventId;
    });

    if (!foundEvents.length)
      return res.sendStatus(404);

    const foundEvent = foundEvents[0];
    foundEvent.updateFromEvent(event);

    schedule.save(function (err) {
      if (err) {
        log.error({err: err});
        return next(err);
      }

      return res.status(200).json({event: foundEvent});
    });
  });
}

function updateScheduledMeal(req, res, next) {
  const scheduleId = req.params.id;
  const mealId = req.params.mealId;
  const meal = req.body;

  models.Schedule.findByScheduleId(scheduleId, function (err, schedule) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!schedule)
      return res.sendStatus(404);

    var foundMeals = schedule.meals.filter(function (meal) {
      return meal._id.toString() === mealId;
    });

    if (!foundMeals.length)
      return res.sendStatus(404);

    const foundMeal = foundMeals[0];
    foundMeal.updateFromMeal(meal);

    schedule.save(function (err) {
      if (err) {
        log.error({err: err});
        return next(err);
      }

      return res.status(200).json({meal: foundMeal});
    });
  });
}

function deleteSchedule(req, res, next) {
  const scheduleId = req.params.id;

  models.Schedule.findByIdAndRemove(scheduleId, function (err, removedSchedule) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!removedSchedule)
      return res.sendStatus(404);

    return res.sendStatus(204);
  });
}

function deleteScheduledEvent(req, res, next) {
  const scheduleId = req.params.id;
  const eventId = req.params.eventId;

  models.Schedule.findByScheduleId(scheduleId, function (err, schedule) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!schedule)
      return res.sendStatus(404);

    const eventIndexToRemove = schedule.events.findIndex(function (event) {
      return event._id.toString() === eventId;
    });

    if (eventIndexToRemove === -1)
      return res.sendStatus(404);

    schedule.events.splice(eventIndexToRemove, 1);

    schedule.save(function (err) {
      if (err) {
        log.error({err: err});
        return next(err);
      }

      return res.sendStatus(204);
    });
  });
}

function deleteScheduledMeal(req, res, next) {
  const scheduleId = req.params.id;
  const mealId = req.params.mealId;

  models.Schedule.findByScheduleId(scheduleId, function (err, schedule) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!schedule)
      return res.sendStatus(404);

    const mealIndexToRemove = schedule.meals.findIndex(function (meal) {
      return meal._id.toString() === mealId;
    });

    if (mealIndexToRemove === -1)
      return res.sendStatus(404);

    schedule.meals.splice(mealIndexToRemove, 1);

    schedule.save(function (err) {
      if (err) {
        log.error({err: err});
        return next(err);
      }

      return res.sendStatus(204);
    });
  });
}
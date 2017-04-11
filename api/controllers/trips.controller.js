'use strict';

const models = require('../../models/models');
const log = require('../../config/logger');

module.exports = {
  getAll: getAllTrips,
  getById: getTripById,
  create: createNewTrip,
  update: updateTrip
};

function getAllTrips(req, res, next) {
  if (req.query.year)
    return _getAllTripsForYear(req, res, next);

  models.Trip.find(function(err, trips) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    return res.status(200).json({trips: trips});
  });
}

function _getAllTripsForYear(req, res, next) {
  const year = parseInt(req.query.year);

  models.Trip.findByTripYear(year, function(err, trips) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    return res.status(200).json({trips: trips});
  });
}

function getTripById(req, res, next) {
  const id = req.params.id;

  models.Trip.findById(id, function(err, trip) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    return res.status(200).json({trip: trip});
  });
}

function createNewTrip(req, res, next) {
  const requestedTrip = new models.Trip(req.body);

  requestedTrip.save(function(err, trip) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    return res.status(201).json({id: trip.id});
  });
}

function updateTrip(req, res, next) {
  const tripId = req.params.id;
  const tripUpdates = req.body;

  models.Trip.findByIdAndUpdate(tripId, tripUpdates, function(err, trip) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    return res.status(200).json({trip: trip});
  });
}
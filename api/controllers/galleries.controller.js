'use strict';

const models = require('../../models/models');
const log = require('../../config/logger');

module.exports = {
  getAll: getAllGalleries,
  getById: getGalleryById,
  create: createGallery,
  update: updateGallery,
  'delete': deleteGallery
};

function getAllGalleries(req, res, next) {
  const tripId = req.query.trip;

  const filter = {};
  if (tripId)
    filter.trip = tripId;

  models.Gallery.find(filter, function (err, galleries) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!galleries || !galleries.length)
      return res.sendStatus(404);

    return res.status(200).json({galleries: galleries});
  });
}

function getGalleryById(req, res, next) {
  const galleryId = req.params.id;

  models.Gallery.findByGalleryId(galleryId, function (err, gallery) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!gallery)
      return res.sendStatus(404);

    return res.status(200).json({gallery: gallery});
  });
}

function createGallery(req, res, next) {
  const requestedGallery = new models.Gallery(req.body);

  requestedGallery.save(function (err, gallery) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    res.status(201).json({id: gallery._id});
  });
}

function updateGallery(req, res, next) {
  const galleryId = req.params.id;
  const gallery = req.body;
  const options = {new: true, runValidators: true};

  models.Gallery.findByIdAndUpdate(galleryId, gallery, options, function (err, updatedGallery) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!gallery)
      return res.sendStatus(404);

    return res.status(200).json({gallery: updatedGallery});
  });
}

function deleteGallery(req, res, next) {
  const galleryId = req.params.id;

  models.Gallery.findByIdAndRemove(galleryId, function (err, removedGallery) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!removedGallery)
      return res.sendStatus(404);

    return res.sendStatus(204);
  });
}

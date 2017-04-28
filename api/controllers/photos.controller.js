'use strict';

const models = require('../../models/models');
const log = require('../../config/logger');

module.exports = {
  getAll: getAllPhotos,
  getById: getPhotoById,
  create: createPhoto,
  update: updatePhoto,
  'delete': deletePhoto
};

function getAllPhotos(req, res, next) {
  models.Photo.find({}, function (err, photos) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!photos || !photos.length)
      return res.sendStatus(404);

    return res.status(200).json({photos: photos});
  });
}

function getPhotoById(req, res, next) {
  const photoId = req.params.id;

  models.Photo.findByPhotoId(photoId, function (err, photo) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!photo)
      return res.sendStatus(404);

    return res.status(200).json({photo: photo});
  });
}

function createPhoto(req, res, next) {
  const requestedPhoto = new models.Photo(req.body);

  requestedPhoto.save(function (err, photo) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    return res.status(201).json({id: photo._id});
  });
}

function updatePhoto(req, res, next) {
  const photoId = req.params.id;
  const photo = req.body;
  const options = {new: true, runValidators: true};

  models.Photo.findByIdAndUpdate(photoId, photo, options, function (err, updatedPhoto) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!updatedPhoto)
      return res.sendStatus(404);

    return res.status(200).json({photo: updatedPhoto});
  });
}

function deletePhoto(req, res, next) {
  const photoId = req.params.id;

  models.Photo.findByIdAndRemove(photoId, function (err, removedPhoto) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!removedPhoto)
      return res.sendStatus(404);

    return res.sendStatus(204);
  });
}
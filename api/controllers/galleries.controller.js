'use strict';

const models = require('../../models/models');
const log = require('../../config/logger');

module.exports = {
  getAll: getAllGalleries,
  getById: getGalleryById,
  getAllPhotos: getAllPhotosInGallery,
  getPhotoById: getPhotoById,
  create: createGallery,
  createPhoto: createPhotoInGallery,
  update: updateGallery,
  updatePhoto: updatePhoto,
  'delete': deleteGallery,
  deletePhoto: deletePhoto
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

function getAllPhotosInGallery(req, res, next) {
  const galleryId = req.params.id;

  models.Gallery.findByGalleryId(galleryId, function (err, gallery) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!gallery || !gallery.photos || !gallery.photos.length)
      return res.sendStatus(404);

    return res.status(200).json({photos: gallery.photos});
  });
}

function getPhotoById(req, res, next) {
  const galleryId = req.params.id;
  const photoId = req.params.photoId;

  models.Gallery.findByGalleryId(galleryId, function (err, gallery) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!gallery)
      return res.sendStatus(404);

    const photos = gallery.photos.filter(function (photo) {
      return photo._id.toString() === photoId;
    });

    if (!photos.length)
      return res.sendStatus(404);

    return res.status(200).json({photo: photos[0]});
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

function createPhotoInGallery(req, res, next) {
  const requestedPhoto = new models.Photo(req.body);
  const galleryId = req.params.id;

  models.Gallery.findByGalleryId(galleryId, function (err, gallery) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!gallery)
      return res.sendStatus(404);

    gallery.photos.push(requestedPhoto);
    gallery.save(function (err, gallery) {
      if (err) {
        log.error({err: err});
        return next(err);
      }

      return res.status(201).json({id: gallery.photos[gallery.photos.length - 1]._id});
    });
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

function updatePhoto(req, res, next) {
  const galleryId = req.params.id;
  const photoId = req.params.photoId;
  const photo = req.body;

  models.Gallery.findByGalleryId(galleryId, function (err, gallery) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!gallery)
      return res.sendStatus(404);

    const foundPhotos = gallery.photos.filter(function (photo) {
      return photo._id.toString() === photoId;
    });

    if (!foundPhotos.length)
      return res.sendStatus(404);

    const foundPhoto = foundPhotos[0];
    foundPhoto.updateFromPhoto(photo);

    gallery.save(function (err) {
      if (err) {
        log.error({err: err});
        return next(err);
      }

      return res.status(200).json({photo: foundPhoto});
    });
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

function deletePhoto(req, res, next) {
  const galleryId = req.params.id;
  const photoId = req.params.photoId;

  models.Gallery.findByGalleryId(galleryId, function (err, gallery) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!gallery)
      return res.sendStatus(404);

    const photoIndexToRemove = gallery.photos.findIndex(function (photo) {
      return photo._id.toString() === photoId;
    });

    if (photoIndexToRemove === -1)
      return res.sendStatus(404);

    gallery.photos.splice(photoIndexToRemove, 1);

    gallery.save(function (err) {
      if (err) {
        log.error({err: err});
        return next(err);
      }

      return res.sendStatus(204);
    });
  });
}
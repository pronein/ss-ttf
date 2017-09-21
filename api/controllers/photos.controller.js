'use strict';

const models = require('../../models/models');
const log = require('../../config/logger');
const path = require('path').win32;
const generateUuid = require('uuid/v4');
const fs = require('fs');

module.exports = {
  getAll: getAllPhotos,
  getById: getPhotoById,
  create: createPhoto,
  update: updatePhoto,
  'delete': deletePhoto,
  upload: uploadPhoto
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

  models.Photo.findById(photoId)
    .populate('uploadedBy')
    .exec(function (err, photo) {
      if (err) {
        log.error({err: err});
        return next(err);
      }

      if (!photo)
        return res.sendStatus(404);

      log.debug({photo: photo});
      return res.status(200).json({photo: photo});
    });
}

function createPhoto(req, res, next) {
  const requestedPhoto = new models.Photo(req.body);

  if (!requestedPhoto.uploadedBy)
    models.User.findOne({username: 'sys'}, function (err, user) {
      if (err) {
        log.error({err: err});
        return next(err);
      }

      requestedPhoto.uploadedBy = user;
      requestedPhoto.save(function (err, photo) {
        if (err) {
          log.error({err: err});
          return next(err);
        }

        return res.status(201).json({id: photo._id});
      });
    });
  else
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

function uploadPhoto(req, res, next) {
  const fileInfo = req.files.photo;
  /*
   .name => given name ("car.jpg")
   .mv => function to move file on server .mv('path/to/new/file.ext', errCb)
   .mimeType => mimeType of file ("image/jpeg")
   .data => image buffered data
   */

  if (!fileInfo)
    return res.status(400).json({msg: 'No file was uploaded.'});

  const mimeTypes = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png', 'image/x-windows-bmp'];
  if (!mimeTypes.includes(fileInfo.mimetype))
    return res.status(400).json({msg: 'Unsupported file type'});

  const appPath = path.resolve();

  const now = new Date();
  const targetDirName = now.getUTCFullYear().toString() +
    ('00' + (now.getUTCMonth() + 1)).slice(-2) +
    ('00' + now.getUTCDay()).slice(-2);

  const targetDirUri = path.join(config.uploads.loosePath, targetDirName);
  const targetDirPath = path.join(appPath, 'public', targetDirUri);

  fs.stat(targetDirPath, function (err, stats) {
    if (err) {
      log.info({msg: targetDirPath + ' does not yet exist, creating...'});

      return fs.mkdir(targetDirPath, function (err) {
        if (err) {
          log.error({err: err});
          return next(err);
        }

        return _moveUploadedFileToNewHome(fileInfo, targetDirPath, targetDirUri, res, next);
      });
    }

    if (!stats.isDirectory()) {
      log.error({msg: targetDirPath + ' exists, but is not a directory!'});
      return next(err);
    }

    return _moveUploadedFileToNewHome(fileInfo, targetDirPath, targetDirUri, res, next);
  });
}

function _moveUploadedFileToNewHome(fileInfo, dir, uri, res, next) {
  const generatedFileName = generateUuid().replace(/-/g, '') + path.extname(fileInfo.name).toLowerCase();

  const finalFileSystemPath = path.join(dir, generatedFileName);
  const relativeUri = path.join(uri, generatedFileName);

  fileInfo.mv(finalFileSystemPath, function (err) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    return res.status(201).json({originalName: fileInfo.name, generatedName: generatedFileName, uri: relativeUri});
  });
}
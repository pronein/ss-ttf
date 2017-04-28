'use strict';

const models = require('../../models/models');
const log = require('../../config/logger');

module.exports = {
  getById: getPermissionById,
  getAll: getAllPermissions,
  update: updatePermission,
  create: createPermission,
  'delete': deletePermission
};

function getAllPermissions(req, res, next) {
  models.Permission.find(function (err, permissions) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!permissions || !permissions.length)
      return res.sendStatus(404);

    return res.status(200).json({permissions: permissions});
  });
}

function getPermissionById(req, res, next) {
  const permissionId = req.params.id;

  models.Permission.findById(permissionId, function (err, permission) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!permission)
      return res.sendStatus(404);

    return res.status(200).json({permission: permission});
  });
}

function updatePermission(req, res, next) {
  const permissionId = req.params.id;
  const permission = req.body;
  const options = {new: true, runValidators: true};

  models.Permission.findByIdAndUpdate(permissionId, permission, options, function (err, updatedPermission) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!updatedPermission)
      return res.sendStatus(404);

    return res.status(200).json({permission: updatedPermission});
  });
}

function createPermission(req, res, next) {
  const requestedPermission = new models.Permission(req.body);

  requestedPermission.save(function (err, permission) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    res.status(201).json({id: permission._id});
  });
}

function deletePermission(req, res, next) {
  const permissionId = req.params.id;

  models.Permission.remove({_id: permissionId}, function (err, removedPermission) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!removedPermission)
      return res.sendStatus(404);

    res.sendStatus(204);
  });
}

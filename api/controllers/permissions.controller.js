'use strict';

const models = require('../../models/models');

module.exports = {
  getById: getPermissionById,
  getAll: getAllPermissions,
  update: updatePermission,
  create: createPermission,
  'delete': deletePermission
};

function getAllPermissions(req, res, next) {
  models.Permission.find(function (err, permissions) {
    if (err)
      return next(err);

    return res.status(200).json({permissions: permissions});
  });
}

function getPermissionById(req, res, next) {
  const permissionId = req.params.id;

  models.Permission.findById(permissionId, function (err, permission) {
    if (err)
      return next(err);

    return res.status(200).json({permission: permission});
  });
}

function updatePermission(req, res, next) {
  const permissionId = req.params.id;
  const permission = req.body;

  models.Permission.findByIdAndUpdate(permissionId, permission, function (err, updatedPermission) {
    if (err)
      return next(err);

    return res.status(200).json({permission: updatedPermission});
  });
}

function createPermission(req, res, next) {
  const requestedPermission = new models.Permission(req.body);

  requestedPermission.save(function (err, permission) {
    if (err)
      return next(err);

    res.status(201).json({id: permission._id});
  });
}

function deletePermission(req, res, next) {
  const permissionId = req.params.id;

  models.Permission.remove({_id: permissionId}, function (err) {
    if (err)
      return next(err);

    res.sendStatus(204);
  });
}

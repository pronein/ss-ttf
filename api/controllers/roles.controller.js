'use strict';

const models = require('../../models/models');
const log = require('../../config/logger');

module.exports = {
  getAll: getAllRoles,
  getById: getRoleById,
  update: updateRole,
  create: createRole,
  'delete': deleteRole
};

function getAllRoles(req, res, next) {
  models.Role.find(function (err, roles) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!roles || !roles.length)
      return res.sendStatus(404);

    return res.status(200).json({roles: roles});
  });
}

function getRoleById(req, res, next) {
  const roleId = req.params.id;

  models.Role.findById(roleId, function (err, role) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!role)
      return res.sendStatus(404);

    return res.status(200).json({role: role});
  });
}

function updateRole(req, res, next) {
  const roleId = req.params.id;
  const role = req.body;
  const options = {new: true, runValidators: true};

  models.Role.findByIdAndUpdate(roleId, role, options, function (err, updatedRole) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!updatedRole)
      return res.sendStatus(404);

    return res.status(200).json({role: updatedRole});
  });
}

function createRole(req, res, next) {
  const requestedRole = new models.Role(req.body);

  requestedRole.save(function (err, role) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    return res.status(201).json({id: role._id});
  });
}

function deleteRole(req, res, next) {
  const roleId = req.params.id;

  models.Role.remove({_id: roleId}, function (err, removedRole) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!removedRole)
      return res.sendStatus(404);

    return res.sendStatus(204);
  });
}
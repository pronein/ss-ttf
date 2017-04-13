'use strict';

const models = require('../../models/models');

module.exports = {
  getById: getRoleById,
  getAll: getAllRoles,
  update: updateRole,
  create: createRole,
  'delete': deleteRole
};

function getAllRoles(req, res, next) {
  models.Role.find(function (err, roles) {
    if (err)
      return next(err);

    return res.status(200).json({roles: roles});
  });
}

function getRoleById(req, res, next) {
  const roleId = req.params.id;

  models.Role.findById(roleId, function (err, role) {
    if (err)
      return next(err);

    return res.status(200).json({role: role});
  });
}

function updateRole(req, res, next) {
  const roleId = req.params.id;
  const role = req.body;

  models.Role.findByIdAndUpdate(roleId, role, function (err, updatedRole) {
    if (err)
      return next(err);

    return res.status(200).json({role: updatedRole});
  });
}

function createRole(req, res, next) {
  const requestedRole = new models.Role(req.body);

  requestedRole.save(function (err, role) {
    if (err)
      return next(err);

    return res.status(201).json({id: role._id});
  });
}

function deleteRole(req, res, next) {
  const roleId = req.params.id;

  models.Role.remove({_id: roleId}, function (err) {
    if (err)
      return next(err);

    return res.sendStatus(204);
  });
}
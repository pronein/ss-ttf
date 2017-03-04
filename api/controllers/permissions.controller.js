const models = require('../../models/models');
const log = require('../../config/logger');
const config = require('../../config/config');
const AuthorizationError = require('../errors').Authorization;

module.exports = {
  getById: getPermissionById,
  updatePermission: updatePermission,
  createPermission: createPermission
};

function getPermissionById(req, res, next) {
  if (!req.isAuthorized) {
    return next(new AuthorizationError('Not Authorized'));
  }

  res.sendStatus(200);
}

function updatePermission(req, res, next) {
  if (!req.isAuthorized) {
    return next(new AuthorizationError('Not Authorized'));
  }

  res.sendStatus(200);
}

function createPermission(req, res, next) {
  if (!req.isAuthorized) {
    return next(new AuthorizationError('Not Authorized'));
  }

  const requestedPermission = new models.Permission(req.body);

  requestedPermission.save(function(err, permission) {
    if(err) {
      return next(err);
    }

    res.status(201).json({id: permission._id});
  });
}

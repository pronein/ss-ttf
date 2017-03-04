const models = require('../../models/models');
const log = require('../../config/logger');
const authHeaderName = require('../../config/passport').authHeaderName;
const config = require('../../config/config');
const AuthorizationError = require('../errors').Authorization;

module.exports = {
  getById: getUserById,
  register: registerNewUser,
  token: getToken
};

function getUserById(req, res, next) {
  if (!req.isAuthorized) {
    return next(new AuthorizationError('Not Authorized'));
  }

  models.User.findByUserId(req.params.id, function (err, user) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.sendStatus(204);
    }

    return res.json(user);
  })
}

function registerNewUser(req, res, next) {

  const requestedUser = new models.User(req.body);

  requestedUser.save(function (err, user) {
    if (err) {
      return next(err);
    }

    return res.status(201).json({id: user._id});
  })
}

function getToken(req, res, next) {
  log.info('Token generated: ' + res.getHeader(authHeaderName));

  return res.sendStatus(200);
}

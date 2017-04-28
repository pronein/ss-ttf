'use strict';

const models = require('../../models/models');
const log = require('../../config/logger');
const authHeaderName = require('../../config/passport').authHeaderName;

module.exports = {
  getMe: getMe,
  getById: getUserById,
  getAll: getAllUsers,
  create: registerNewUser,
  token: getToken,
  'delete': deleteUser,
  update: updateUser
};

function getMe(req, res, next) {
  return res.status(200).json({user: req.user});
}

function getAllUsers(req, res, next) {
  models.User.find({}, function (err, users) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!users || !users.length)
      return res.sendStatus(404);

    return res.status(200).json({users: users});
  });
}

function deleteUser(req, res, next) {
  const userId = req.params.id;

  models.User.remove({_id: userId}, function (err, removedUser) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!removedUser)
      return res.sendStatus(404);

    return res.sendStatus(204);
  });
}

function updateUser(req, res, next) {
  const url = req.url;
  const userId = url === '/me' ? req.user.id : req.params.id;
  const user = req.body;
  const options = {new: true, runValidators: true};

  models.User.findByIdAndUpdate(userId, user, options, function (err, updatedUser) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!updatedUser)
      return res.sendStatus(404);

    return res.status(200).json({user: updatedUser});
  });
}

function getUserById(req, res, next) {
  const userId = req.params.id;

  models.User.findByUserId(userId, function (err, user) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!user)
      return res.sendStatus(404);

    return res.status(200).json({user: user});
  });
}

function registerNewUser(req, res, next) {
  const requestedUser = new models.User(req.body);

  requestedUser.save(function (err, user) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    return res.status(201).json({id: user._id});
  })
}

function getToken(req, res, next) {
  log.debug('Token generated: ' + res.getHeader(authHeaderName));

  return res.sendStatus(200);
}

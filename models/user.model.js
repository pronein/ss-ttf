'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const log = require('../config/logger');
const Errors = require('../api/errors');

var userSchema = new Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  avatar: {type: Schema.Types.ObjectId, ref: 'Photo'},
  email: String,
  roles: [{type: Schema.Types.ObjectId, ref: 'Role'}],
  registrationDate: Date
});

userSchema.statics.findByUserId = function (userId, errUserCb) {
  return this.findById({_id: userId}, errUserCb);
};

userSchema.statics.findByUsername = function (username, errUserCb) {
  return this.findOne({username: username}, errUserCb);
};

userSchema.statics.hasAuthorization = function (userId, permissionRequested, errSuccessCb) {
  this.findByUserId(userId, function (err, user) {
    if (err) {
      log.error({err: err});
      return errSuccessCb(err);
    }

    user.isAuthorized(permissionRequested, errSuccessCb);
  });
};

userSchema.methods.validatePassword = function (password, errSuccessCb) {
  log.debug('validatePassword: ' + password + ' ' + this.password);

  bcrypt.compare(password, this.password, errSuccessCb);
};

userSchema.methods.isAuthorized = function (permissionsRequested, errSuccessCb) {
  if (!Array.isArray(permissionsRequested))
    permissionsRequested = [permissionsRequested];

  User.aggregate()
    .unwind('$roles')
    .lookup({
      from: 'roles',
      localField: 'roles',
      foreignField: '_id',
      as: 'user_roles'
    })
    .match({user_roles: {$ne: []}})
    .unwind('$user_roles')
    .project({
      _id: 0,
      role_permissions: {
        $setUnion: ['$user_roles.permissions']
      }
    })
    .unwind('$role_permissions')
    .group({
      _id: {$literal: 1},
      permissions: {
        $addToSet: '$role_permissions'
      }
    })
    .project({
      _id: 0,
      permissions: 1
    })
    .exec(function (err, rolePermissions) {
      if (err) {
        log.error({err: err});
        return errSuccessCb(err);
      }

      const success = (permissionsRequested || [])
        .map(function (permission) {
          return permission._id;
        })
        .every(function (requestedPermissionId) {
          return rolePermissions.length && rolePermissions.find(function (role) {
              return role.permissions.find(function (rolePermissionId) {
                return requestedPermissionId.equals(rolePermissionId);
              });
            });
        });

      errSuccessCb(null, success);
    });
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user._id;
  delete user.password;
  delete user.__v;

  return user;
};

userSchema.pre('save', function (next) {
  const user = this;

  if (!user.registrationDate) {
    log.debug('pre-save: registrationDate not defined, setting default.');
    user.registrationDate = new Date();
  }

  if (user.isModified('password')) {
    log.debug('pre-save: password modified, hashing...');

    bcrypt.hash(this.password, null, null, function (err, hash) {
      if (err) {
        log.error({err: err});
        return next(err);
      }

      user.password = hash;

      return _validateUserAvatar(user, next);
    });
  } else
    return _validateUserAvatar(user, next);
});

function _validateUserAvatar(user, next) {
  if (!user.avatar) {
    log.debug('pre-save: avatar not defined, setting default.');

    const PhotoModel = require('./photo.model');
    PhotoModel.Photo.find({name: PhotoModel.NoAvatarName}, function (err, photo) {
      if (err) {
        log.error({err: err});
        return next(err);
      }

      if (!photo) {
        const photoErr = new Errors.PhotoNotFound(PhotoModel.NoAvatarName);
        log.error({err: photoErr});
        return next(photoErr);
      }

      user.avatar = photo;

      return next();
    });
  } else
    next();
}

const User = module.exports = mongoose.model('User', userSchema);
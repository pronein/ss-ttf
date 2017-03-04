const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const log = require('../config/logger');

const Schema = mongoose.Schema;

var userSchema = new Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
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
    if (err){
      log.error({err: err});
      return errSuccessCb(err);
    }

    user.isAuthorized(permissionRequested, errSuccessCb);
  })
};

userSchema.methods.validatePassword = function (password, errSuccessCb) {
  log.debug('validatePassword: ' + password + ' ' + this.password);

  bcrypt.compare(password, this.password, errSuccessCb);
};

userSchema.methods.isAuthorized = function (permissionsRequested, errSuccessCb) {
  if(!Array.isArray(permissionsRequested)) {
    permissionsRequested = [permissionsRequested];
  }

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
    .exec(function (err, results) {
      if (err) {
        log.error({err: err});
        return errSuccessCb(err);
      }

      //permissionsRequested => permissionsRequested.map(function(p) { return p.toString() })[0] == permission_admin
      //  but expecting permission document

      //results.map(function(r) {return r.permissions})[0].toString() == 58bb15e827059f946caea6d0
      //  but not flattening enough
      const success = (permissionsRequested || [])
        .map(function (permission) {
          return permission._id;
        })
        .every(function (permission) {
          return results.length && results.permissions.find(function (resultPermission) {
            return permission === resultPermission;
          });
        });

      errSuccessCb(null, success);
    });
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user._id;
  delete user.password;
  //noinspection JSUnresolvedVariable
  delete user.__v;

  return user;
};

userSchema.pre('save', function (next) {
  var user = this;

  if (!user.registrationDate) {
    user.registrationDate = new Date();
  }
  if (user.isModified('password')) {
    bcrypt.hash(this.password, null, null, function (err, hash) {
      if (err) next(err);

      user.password = hash;
      next();
    });
  }
});

const User = module.exports = mongoose.model('User', userSchema);

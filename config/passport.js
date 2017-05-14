'use strict';

const passport = require('passport');
const basicStrategy = require('./strategies/basic');
const jwt = require('jsonwebtoken');
const config = require('./config');

const models = require('../models/models');
const User = models.User;
const Permission = models.Permission;

const errors = require('../api/errors');
const AuthorizationError = errors.Authorization;
const InternalServerError = errors.InternalServer;

const log = require('./logger');
const debug = require('debug')('ss-ttf:passport');

const AUTH_HEADER = 'x-ss-auth';

// Setup all strategies here
passport.use(basicStrategy);

module.exports = {
  initialized: passport.initialize(),
  authHeaderName: AUTH_HEADER,

  isAuthorized: isAuthorized,
  generateToken: generateToken
};

function isAuthorized(permissionKeys) {
  //sanity check to force array
  if (!permissionKeys) {
    permissionKeys = [];
  } else if (!Array.isArray(permissionKeys)) {
    permissionKeys = [permissionKeys];
  }

  return function (req, res, next) {
    const auth = req.headers['authorization'];
    req.isAuthorized = false;

    if (auth) {
      const parts = auth.split(' ');
      if (parts.length < 2 || parts[0].toLowerCase() !== 'bearer')
        return next();

      const token = parts[1];
      jwt.verify(token, config.jwt.secret, function (err, decoded) {
        if (err) {
          log.error({err: err});
          return next(err);
        }

        User.findByUserId(decoded.sub, function (err, user) {
          if (err) {
            log.error({err: err});
            return next(err);
          }

          req.user = user;

          if (!permissionKeys.length) {
            req.isAuthorized = true;
            return generateToken(req, res, next);
          }

          Permission.getPermissionsByKeys(permissionKeys, function (err, permissions) {
            if (err) {
              log.error({err: err});
              return next(err);
            }

            if (permissionKeys.length !== permissions.length) {
              const invalidPermissionErr = new InternalServerError('Invalid permission requested.');
              log.error({err: invalidPermissionErr});
              return next(invalidPermissionErr);
            }

            User.hasAuthorization(decoded.sub, permissions, function (err, authorized) {
              if (err) {
                log.error({err: err});
                return next(err);
              }

              if (req.isAuthorized = authorized)
                return generateToken(req, res, next);

              return next(new AuthorizationError('Not Authorized.'));
            });
          });
        });
      });
    } else {
      return next(new AuthorizationError('Not Authorized.'));
    }
  }
}

function generateToken(req, res, next) {
  const now = Date.now();
  const exp = new Date(now);
  const minutes = exp.getMinutes();

  const payload = {
    iss: config.jwt.issuer,
    sub: req.user._id,
    aud: 'ss-ttf',
    iat: now / 1000,
    nbf: now / 1000 - 5,
    exp: exp.setMinutes(minutes + config.jwt.timeOut) / 1000
  };

  jwt.sign(payload, config.jwt.secret, {}, function (err, token) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    res.setHeader(AUTH_HEADER, token);

    return next();
  });
}

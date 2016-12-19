const passport = require('passport');
const basicStrategy = require('./strategies/basic');
const jwt = require('jsonwebtoken');
const config = require('./config');
const User = require('../models/models').User;
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

function isAuthorized(role) {
  return function (req, res, next) {
    const auth = req.headers['authorization'];
    req.isAuthorized = false;

    if (auth) {
      const parts = auth.split(' ');
      if (parts.length < 2 || parts[0].toLowerCase() !== 'bearer') {
        return next();
      }

      const token = parts[1];
      const payload = jwt.decode(token);
      jwt.verify(token, config.jwt.secret, function (err, decoded) {
        if (err) {
          log.error({err: err});
          return next(err);
        }

        User.hasAuthorization(decoded.sub, role, function (err, authorized) {
          if (err) {
            log.error({err: err});
            return next(err);
          }

          req.isAuthorized = authorized;
          generateToken(req, res, next);
        });
      });
    }
  }
}

function generateToken(req, res, next) {
  var now = Date.now();
  var exp = new Date(now);
  var minutes = exp.getMinutes();
  var timeOut = config.jwt.timeOut;

  var payload = {
    iss: 'http://ttf.ajschrader.com/',
    sub: req.user._id,
    aud: 'ss-ttf',
    iat: now / 1000,
    nbf: now / 1000,
    exp: exp.setMinutes(minutes + timeOut) / 1000
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

const BasicStrategy = require('passport-http').BasicStrategy;
const User = require('../../models/models').User;
const log = require('../logger');

module.exports = new BasicStrategy({}, function (username, password, done) {
  log.debug('Basic Strategy: ' + username + ' ' + password);
  User.findByUsername(username, function (err, user) {
    if (err) return done(err);

    log.debug('Basic Strategy: ' + JSON.stringify(user) + ' ' + user.password);
    user.validatePassword(password, function (err, success) {
      if (err) return done(err);

      log.debug('Basic Strategy: ' + success.toString());
      if (!success) {
        return done(null, success);
      }

      return done(null, user);
    });
  });
});
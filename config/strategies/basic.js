const BasicStrategy = require('passport-http').BasicStrategy;
const User = require('../../models/models').User;

module.exports = new BasicStrategy({}, function (username, password, done) {
  console.log('Basic Strategy: ' + username + ' ' + password);
  User.findByUsername(username, function (err, user) {
    if (err) return done(err);

    console.log('Basic Strategy: ' + JSON.stringify(user) + ' ' + user.password);
    user.validatePassword(password, function (err, success) {
      if (err) return done(err);

      console.log('Basic Strategy: ' + success.toString());
      if (!success) {
        return done(null, success);
      }

      return done(null, user);
    });
  });
});
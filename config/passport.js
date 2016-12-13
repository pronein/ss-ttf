const passport = require('passport');
const basicStrategy = require('./strategies/basic');

// Setup all strategies here
passport.use(basicStrategy);

module.exports = passport.initialize();
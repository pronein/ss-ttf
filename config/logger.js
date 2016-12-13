const bunyan = require('bunyan');
const config = require('./config');

const options = config.bunyan.baseOptions;

const logger = bunyan.createLogger(options);

module.exports = logger;
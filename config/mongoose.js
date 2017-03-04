const config = require('./config');
const mongoose = require('mongoose');
const log = require('./logger');

log.info('Connecting to ' + config.mongo.connectionString);
mongoose.connect(config.mongo.connectionString);

require('../models/user.model');

const connectionString = require('./config').mongo.mongooseConnectionString();
const mongoose = require('mongoose');
const log = require('./logger');

log.info('Connecting to ' + connectionString);
mongoose.connect(connectionString);

require('../models/user.model');

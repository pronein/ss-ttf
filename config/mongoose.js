const config = require('./config');
const mongoose = require('mongoose');

mongoose.connect(config.mongo.connectionString);

require('../models/user.model');

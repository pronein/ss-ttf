const mongoose = require('mongoose');
const log = require('../config/logger');

const Schema = mongoose.Schema;

const permissionSchema = new Schema({
  name: String,
  key: String,
  description: String,
  url: String
});

permissionSchema.methods.toJSON = function () {
  const permission = this.toObject();
  delete permission._id;
  //noinspection JSUnresolvedVariable
  delete permission.__v;

  return permission;
};

module.exports = mongoose.model('Permission', permissionSchema);

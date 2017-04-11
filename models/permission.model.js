'use strict';

const mongoose = require('mongoose');
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
  delete permission.__v;

  return permission;
};

permissionSchema.statics.getPermissionsByKeys = function (permissionKeys, errPermissionsCb) {
  if (!Array.isArray(permissionKeys))
    permissionKeys = [permissionKeys];

  return this.find({key: {$in: permissionKeys}}, errPermissionsCb);
};

module.exports = mongoose.model('Permission', permissionSchema);

const mongoose = require('mongoose');
const log = require('../config/logger');


const Schema = mongoose.Schema;

const roleSchema = new Schema({
  name: String,
  description: String,
  permissions: [{type: Schema.Types.ObjectId, ref: 'Permission'}]
});

roleSchema.methods.toJSON = function () {
  const role = this.toObject();

  delete role._id;
  //noinspection JSUnresolvedVariable
  delete role.__v;

  return role;
};

module.exports = mongoose.model('Role', roleSchema);

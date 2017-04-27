'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const generateUuid = require('uuid/v4');
const log = require('../config/logger');

/*
 Photo Schema
 */
const photoSchema = new Schema({
  caption: String,
  date: Date,
  name: String,
  uploadedOn: Date,
  uploadedBy: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  uploadLocation: {
    latitude: Number,
    longitude: Number
  }
});

photoSchema.methods.updateFromPhoto = function (photo) {
  if (photo.hasOwnProperty('caption'))
    this.caption = photo.caption;

  if (photo.hasOwnProperty('date'))
    this.date = photo.date;

  if (photo.hasOwnProperty('name'))
    this.name = photo.name;

  if (photo.hasOwnProperty('uploadLocation')) {
    if (photo.uploadLocation.hasOwnProperty('latitude'))
      this.uploadLocation.latitude = photo.uploadLocation.latitude;

    if (photo.uploadLocation.hasOwnProperty('longitude'))
      this.uploadLocation.longitude = photo.uploadLocation.longitude;
  }
};

photoSchema.pre('save', function (next) {
  const photo = this;
  const now = new Date();

  if (!photo.date) {
    log.debug('pre-save: date not defined, setting default.');

    photo.date = now;
  }

  if (!photo.uploadedOn) {
    log.debug('pre-save: uploadedOn not defined, setting default.');

    photo.uploadedOn = now;
  }

  if (!photo.name) {
    log.debug('pre-save: name not defined, generating default.');

    photo.name = generateUuid().toString().replace('-', '');
  }

  next();
});

photoSchema.methods.toJSON = function () {
  const photo = this.toObject();

  delete photo._id;
  delete photo.__v;

  return photo;
};

const Photo = mongoose.model('Photo', photoSchema);

module.exports = {
  Photo: Photo,
  NoAvatarName: 'no_avatar.jpg'
};
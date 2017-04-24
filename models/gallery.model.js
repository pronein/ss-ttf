'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const log = require('../config/logger');

/*
 Photo Schema
 */
const photoSchema = new Schema({
  caption: String,
  url: {type: String, required: true},
  uploadedBy: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  uploadLocation: {
    latitude: Number,
    longitude: Number
  }
});

photoSchema.methods.updateFromPhoto = function (photo) {
  if (photo.hasOwnProperty('caption'))
    this.caption = photo.caption;

  if (photo.hasOwnProperty('url'))
    this.url = photo.url;

  if (photo.hasOwnProperty('uploadLocation')) {
    if (photo.uploadLocation.hasOwnProperty('latitude'))
      this.uploadLocation.latitude = photo.uploadLocation.latitude;

    if (photo.uploadLocation.hasOwnProperty('longitude'))
      this.uploadLocation.longitude = photo.uploadLocation.longitude;
  }
};

photoSchema.methods.toJSON = function () {
  const photo = this.toObject();

  delete photo._id;
  delete photo.__v;

  return photo;
};

const Photo = mongoose.model('Photo', photoSchema);

/*
 Gallery Schema
 */
const gallerySchema = new Schema({
  title: {type: String, required: true},
  photos: [photoSchema],
  createdBy: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  trip: {type: Schema.Types.ObjectId, ref: 'Trip', required: true}
});

gallerySchema.statics.findByGalleryId = function (galleryId, errGalleryCb) {
  return this.findById(galleryId, errGalleryCb);
};

gallerySchema.methods.toJSON = function () {
  const gallery = this.toObject();

  delete gallery._id;
  delete gallery.__v;

  return gallery;
};

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = {
  Gallery: Gallery,
  Photo: Photo
};

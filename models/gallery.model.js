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
  updloadLocation: {
    latitude: Number,
    longitude: Number
  }
});

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

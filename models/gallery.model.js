'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const log = require('../config/logger');

/*
 Gallery Schema
 */
const gallerySchema = new Schema({
  title: {type: String, required: true},
  photos: [{type: Schema.Types.ObjectId, ref: 'Photo'}],
  createdBy: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  trip: {type: Schema.Types.ObjectId, ref: 'Trip', required: true},
  createdOn: {type: Date, default: new Date()}
});

gallerySchema.statics.findByGalleryId = function (galleryId, errGalleryCb) {
  return this.findById(galleryId, errGalleryCb);
};

gallerySchema.methods.updateFromGallery = function (gallery) {
  if (gallery.hasOwnProperty('title'))
    this.title = gallery.title;

  if (gallery.hasOwnProperty('trip'))
    this.trip = gallery.trip;

  if (gallery.hasOwnProperty('photos'))
    this.photos = gallery.photos;
};

gallerySchema.methods.toJSON = function () {
  const gallery = this.toObject();

  delete gallery._id;
  delete gallery.__v;

  return gallery;
};

const Gallery = module.exports = mongoose.model('Gallery', gallerySchema);

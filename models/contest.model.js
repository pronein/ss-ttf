'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const log = require('../config/logger');

/*
  Fish Schema
 */
const fishSchema = new Schema({
  species: {type: String, required: true},
  timeHooked: Date,
  timeLanded: Date,
  wasCaught: {type: Boolean, default: false},
  length: {type: Number, default: 0},
  weight: {type: Number, default: 0},
  caughtBy: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  locationHooked: {
    latitude: Number,
    longitude: Number
  },
  locationLanded: {
    latitude: Number,
    longitude: Number
  }
});

fishSchema.methods.toJSON = function() {
  const fish = this.toObject();

  delete fish._id;
  delete fish.__v;

  return fish;
};

const Fish = mongoose.model('Fish', fishSchema);

/*
  Contest Schema
 */
const contestSchema = new Schema({
  title: {type: String, required: true},
  scoring: [{
    species: {type: String, required: true},
    value: {type: Number, default: 0}
  }],
  fishCaught: [fishSchema],
  startTime: {type: Date, required: true},
  endTime: {type: Date, required: true}
});

contestSchema.statics.findByContestId = function (contestId, errContestCb) {
  return this.findById(contestId, errContestCb);
};

contestSchema.methods.toJSON = function () {
  const contest = this.toObject();

  delete contest._id;
  delete contest.__v;

  return contest;
};

const Contest = mongoose.model('Contest', contestSchema);

module.exports = {
  Contest: Contest,
  Fish: Fish
};
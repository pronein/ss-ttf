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

fishSchema.methods.toJSON = function () {
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
  contestants: [{type: Schema.Types.ObjectId, ref: 'User'}],
  startTime: {type: Date, required: true},
  endTime: {type: Date, required: true},
  trip: {type: Schema.Types.ObjectId, ref: 'Trip'}
});

contestSchema.statics.findByContestId = function (contestId, errContestCb) {
  return this.findById(contestId, errContestCb);
};

contestSchema.statics.findScoresByContestId = function (contestId, errContestantsCb) {
  this.findById(contestId)
    .populate('fishCaught')
    //.populate('contestants')
    //.populate('contestants.avatar')
    .exec(function (err, contest) {
      if (err) {
        log.error({err: err});
        return errContestantsCb(err);
      }

      if (!contest) {
        log.warn({warning: 'Contest [' + contestId + '] not found.'});
        return errContestantsCb(err, []);
      }

      const contestantScores = {};

      contest.fishCaught.forEach(function (fish) {
        if (!(contestantScores[fish.caughtBy] >= 0))
          contestantScores[fish.caughtBy] = 0;

        contestantScores[fish.caughtBy] += contest.scoring.find(function (fishType) {
          return fishType.species === fish.species;
        });
      });

      mongoose.model('User').find({
        _id: {$in: contest.contestants}
      }, {
        _id: 1,
        username: 1,
        avatar: 1
      }).populate('avatar')
        .exec(function (err, users) {
          if (err) {
            log.error({err: err});
            return errContestantsCb(err);
          }

          const contestants = [];

          //contest.contestants
          users.forEach(function (contestant) {
            contestants.push({
              username: contestant.username,
              score: contestantScores[contestant._id] || 0,
              avatarUri: contestant.avatar.image.uri
            });
          });

          return errContestantsCb(null, contestants);
        });
    });
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
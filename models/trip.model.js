'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var tripSchema = new Schema({
  startDate: Date,
  endDate: Date,
  locationLatitude: Number,
  locationLongitude: Number
});

tripSchema.statics.findByTripId = function (tripId, errTripCb) {
  return this.findById({_id: tripId}, errTripCb);
};

tripSchema.statics.findByTripYear = function (year, errTripCb) {
  //db.trips.find({$and:[{startDate: {$lt: ISODate('2018-01-01')}}, {startDate: {$gt: ISODate('2017-05-01')}} ]})
  const minDate = new Date(year.toString() + '-01-01');
  const maxDate = new Date((year + 1).toString() + '-01-01');
  return this.find({
      $and: [
        {startDate: {$lt: maxDate}},
        {startDate: {$gt: minDate}}
      ]
    },
    errTripCb);
};

tripSchema.methods.toJSON = function () {
  const trip = this.toObject();

  delete trip._id;
  delete trip.__v;

  return trip;
};

const Trip = module.exports = mongoose.model('Trip', tripSchema);
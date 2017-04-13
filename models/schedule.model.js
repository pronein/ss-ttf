'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
 Meal Schema (child)
 */
const mealSchema = new Schema({
  title: {type: String, required: true},
  designation: {type: String, required: true}, //Should be Breakfast|Lunch|Dinner|Snack|Anytime
  date: {type: Date, required: true},
  createdBy: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
  providedBy: {type: Schema.Types.ObjectId, required: true, ref: 'User'}
});

mealSchema.methods.updateFromMeal = function (meal) {
  if (meal.hasOwnProperty('title'))
    this.title = meal.title;
  if (meal.hasOwnProperty('designation'))
    this.designation = meal.designation;
  if (meal.hasOwnProperty('date'))
    this.date = meal.date;
  if (meal.hasOwnProperty('providedBy'))
    this.providedBy = meal.providedBy;
};

mealSchema.methods.toJSON = function () {
  const meal = this.toObject();

  delete meal._id;
  delete meal.__v;

  return meal;
};

const Meal = mongoose.model('Meal', mealSchema);

/*
 Event Schema (child)
 */
const eventSchema = new Schema({
  title: {type: String, required: true},
  startTime: {type: Date, required: true},
  endTime: {type: Date, required: true},
  createdBy: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
  members: [{type: Schema.Types.ObjectId, ref: 'User'}],
  description: String
});

eventSchema.methods.updateFromEvent = function (event) {
  if (event.hasOwnProperty('title'))
    this.title = event.title;
  if (event.hasOwnProperty('startTime'))
    this.startTime = event.startTime;
  if (event.hasOwnProperty('endTime'))
    this.endTime = event.endTime;
  if (event.hasOwnProperty('members'))
    this.members = event.members;
  if (event.hasOwnProperty('description'))
    this.description = event.description;
};

eventSchema.methods.toJSON = function () {
  const event = this.toObject();

  delete event._id;
  delete event.__v;

  return event;
};

const Event = mongoose.model('Event', eventSchema);

/*
 Schedule Schema (parent)
 */
const scheduleSchema = new Schema({
  month: {type: Number, required: true},
  year: {type: Number, required: true},
  events: [{type: Schema.Types.ObjectId, ref: 'Event'}],
  meals: [{type: Schema.Types.ObjectId, ref: 'Meal'}],
  title: String,
  createdBy: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
  associatedTrip: {type: Schema.Types.ObjectId, required: true, ref: 'Trip'}
});

scheduleSchema.statics.findByScheduleId = function (scheduleId, errScheduleCb) {
  return this.findById(scheduleId, errScheduleCb);
};

scheduleSchema.methods.toJSON = function () {
  const schedule = this.toObject();

  delete schedule._id;
  delete schedule.__v;

  return schedule;
};

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = {
  Schedule: Schedule,
  Meal: Meal,
  Event: Event
};
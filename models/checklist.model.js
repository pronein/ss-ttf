'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
 Checklist Item Schema (child)
 */
const checklistItemSchema = new Schema({
  description: {type: String, required: true},
  isChecked: {type: Boolean, default: false},
  accessLevel: {type: Schema.Types.Mixed, default: false} //Should be true|false|[ObjectId()]
});

checklistItemSchema.methods.updateFromItem = function (checklistItem) {
  if (checklistItem.hasOwnProperty('description'))
    this.description = checklistItem.description;

  if (checklistItem.hasOwnProperty('isChecked'))
    this.isChecked = checklistItem.isChecked;

  if (checklistItem.hasOwnProperty('accessLevel'))
    this.accessLevel = checklistItem.accessLevel;
};

checklistItemSchema.methods.toJSON = function () {
  const checklistItem = this.toObject();

  delete checklistItem._id;
  delete checklistItem.__v;

  return checklistItem;
};

const ChecklistItem = mongoose.model('ChecklistItem', checklistItemSchema);

/*
 Checklist Schema (parent)
 */
const checklistSchema = new Schema({
  title: {type: String, required: true},
  items: [checklistItemSchema],
  createdBy: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
  trip: {type: Schema.Types.ObjectId, required: true, ref: 'Trip'},
  accessibleBy: {type: Schema.Types.Mixed, default: false} //Should be true|false|[ObjectId()]
});

checklistSchema.statics.findByChecklistId = function (checklistId, errChecklistCb) {
  return this.findById(checklistId, errChecklistCb);
};

checklistSchema.methods.toJSON = function () {
  const checklist = this.toObject();

  delete checklist._id;
  delete checklist.__v;

  return checklist;
};

const Checklist = mongoose.model('Checklist', checklistSchema);

module.exports = {
  Checklist: Checklist,
  ChecklistItem: ChecklistItem
};
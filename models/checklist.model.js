'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
  Checklist Item Schema (child)
 */
const checklistItemSchema = new Schema({
  description: String,
  isChecked: Boolean,
  accessLevel: Schema.Types.Mixed //Should be true|false|[ObjectId()]
});

checklistItemSchema.statics.findByChecklistItemId = function (checklistItemId, errChecklistItemCb) {
  return this.findById(checklistItemId, errChecklistItemCb);
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
  title: String,
  items: [checklistItemSchema],
  createdBy: Schema.Types.ObjectId,
  trip: Schema.Types.ObjectId,
  accessibleBy: Schema.Types.Mixed //Should be true|false|[ObjectId()]
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
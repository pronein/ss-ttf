'use strict';

const UserModel = require('./user.model');
const PermissionModel = require('./permission.model');
const RoleModel = require('./role.model');
const TripModel = require('./trip.model');
const CheckListModel = require('./checklist.model');
const ScheduleModel = require('./schedule.model');
const PhotoModel = require('./photo.model');
const GalleryModel = require('./gallery.model');
const ContestModel = require('./contest.model');

module.exports = {
  User: UserModel,
  Role: RoleModel,
  Permission: PermissionModel,
  Trip: TripModel,
  Checklist: CheckListModel.Checklist,
  ChecklistItem: CheckListModel.ChecklistItem,
  Schedule: ScheduleModel.Schedule,
  Meal: ScheduleModel.Meal,
  Event: ScheduleModel.Event,
  Photo: PhotoModel.Photo,
  Gallery: GalleryModel,
  Contest: ContestModel.Contest,
  Fish: ContestModel.Fish
};

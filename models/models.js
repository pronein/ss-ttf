'use strict';

const UserModel = require('./user.model');
const PermissionModel = require('./permission.model');
const RoleModel = require('./role.model');
const TripModel = require('./trip.model');
const CheckListModel = require('./checklist.model');
const ScheduleModel = require('./schedule.model');

module.exports = {
  User: UserModel,
  Role: RoleModel,
  Permission: PermissionModel,
  Trip: TripModel,
  Checklist: CheckListModel.Checklist,
  ChecklistItem: CheckListModel.ChecklistItem,
  Schedule: ScheduleModel.Schedule,
  Meal: ScheduleModel.Meal,
  Event: ScheduleModel.Event
};
'use strict';

const UserModel = require('./user.model');
const PermissionModel = require('./permission.model');
const RoleModel = require('./role.model');
const TripModel = require('./trip.model');
const CheckListModel = require('./checklist.model');

module.exports = {
  User: UserModel,
  Role: RoleModel,
  Permission: PermissionModel,
  Trip: TripModel,
  CheckList: CheckListModel.Checklist,
  CheckListItem: CheckListModel.ChecklistItem
};
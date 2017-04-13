'use strict';

const models = require('../../models/models');
const log = require('../../config/logger');

module.exports = {
  getAll: getAllChecklists,
  getById: getChecklistById,
  getAllItems: getAllChecklistItems,
  getItemById: getChecklistItemById,
  create: createChecklist,
  createItem: createChecklistItem,
  update: updateChecklist,
  updateItem: updateChecklistItem,
  'delete': deleteChecklist,
  deleteItem: deleteChecklistItem
};

function getAllChecklists(req, res, next) {
  const tripId = req.query.trip;
  const userId = req.query.user;

  const filter = {};
  if (tripId) {
    filter.$and = [{trip: tripId}];
  }

  if (userId) {
    if (filter.$and)
      filter.$and.push({createdBy: userId});
    else
      filter.createdBy = userId;
  }

  models.Checklist.find(filter, function (err, checklists) {
    if (err)
      return next(err);

    if (!checklists || !checklists.length)
      return res.sendStatus(404);

    return res.status(200).json({checklists: checklists});
  });
}

function getChecklistById(req, res, next) {
  const checklistId = req.params.id;

  models.Checklist.findByChecklistId(checklistId, function (err, checklist) {
    if (err)
      return next(err);

    if (!checklist)
      return res.sendStatus(404);

    return res.status(200).json({checklist: checklist});
  });
}

function getAllChecklistItems(req, res, next) {
  const checklistId = req.params.id;

  models.Checklist.findByChecklistId(checklistId, function (err, checklist) {
    if (err)
      return next(err);

    if (!checklist)
      return res.sendStatus(404);

    return res.status(200).json({items: checklist.items});
  });
}

function getChecklistItemById(req, res, next) {
  const checklistId = req.params.id;
  const checklistItemId = req.params.itemId;

  models.Checklist.findByChecklistId(checklistId, function (err, checklist) {
    if (err)
      return next(err);

    if (!checklist)
      return res.sendStatus(404);

    const items = checklist.items.filter(function (item) {
      return item._id.toString() === checklistItemId;
    });

    if (!items.length)
      return res.sendStatus(404);

    return res.status(200).json({item: items[0]});
  });
}

function createChecklist(req, res, next) {
  const requestedChecklist = new models.Checklist(req.body);

  requestedChecklist.save(function (err, checklist) {
    if (err)
      return next(err);

    res.status(201).json({id: checklist._id});
  });
}

function createChecklistItem(req, res, next) {
  const requestedChecklistItem = new models.ChecklistItem(req.body);
  const checklistId = req.params.id;

  models.Checklist.findById(checklistId, function (err, checklist) {
    if (err)
      return next(err);

    if (!checklist)
      return res.sendStatus(404);

    checklist.items.push(requestedChecklistItem);
    checklist.save(function (err, checklist) {
      if (err)
        return next(err);

      return res.status(201).json({id: checklist.items[checklist.items.length - 1]._id});
    });
  });
}

function updateChecklist(req, res, next) {
  const checklistId = req.params.id;
  const checklist = req.body;
  const options = {new: true, runValidators: true};

  models.Checklist.findByIdAndUpdate(checklistId, checklist, options, function (err, updatedChecklist) {
    if (err)
      return next(err);

    if (!updatedChecklist)
      return res.sendStatus(404);

    return res.status(200).json({checklist: updatedChecklist});
  });
}

function updateChecklistItem(req, res, next) {
  const checklistId = req.params.id;
  const checklistItemId = req.params.itemId;
  const checklistItem = req.body;

  models.Checklist.findByChecklistId(checklistId, function (err, checklist) {
    if (err)
      return next(err);

    if (!checklist)
      return res.sendStatus(404);

    var foundItems = checklist.items.filter(function (item) {
      return item._id.toString() === checklistItemId;
    });

    if (!foundItems.length)
      return res.sendStatus(404);

    const foundItem = foundItems[0];
    foundItem.updateFromItem(checklistItem);

    checklist.save(function (err) {
      if (err)
        return next(err);

      return res.status(200).json({item: foundItem});
    });
  });
}

function deleteChecklist(req, res, next) {
  const checklistId = req.params.id;

  models.Checklist.findByIdAndRemove(checklistId, function (err, removedChecklist) {
    if (err)
      return next(err);

    if (!removedChecklist)
      return res.sendStatus(404);

    return res.sendStatus(200);
  });
}

function deleteChecklistItem(req, res, next) {
  const checklistId = req.params.id;
  const checklistItemId = req.params.itemId;

  models.Checklist.findById(checklistId, function (err, checklist) {
    if (err)
      return next(err);

    if (!checklist)
      return res.sendStatus(404);

    const itemIndexToRemove = checklist.items.findIndex(function (item) {
      return item._id.toString() === checklistItemId;
    });

    if (itemIndexToRemove === -1)
      return res.sendStatus(404);

    checklist.items.splice(itemIndexToRemove, 1);

    checklist.save(function (err) {
      if (err)
        return next(err);

      return res.sendStatus(200);
    });
  });
}
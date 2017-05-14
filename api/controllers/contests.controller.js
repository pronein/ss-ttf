'use strict';

const models = require('../../models/models');
const log = require('../../config/logger');

module.exports = {
  getAll: getAllContests,
  getById: getContestsById,
  getContestScores: getContestScoresById,
  create: createContests,
  update: updateContests,
  'delete': deleteContests
};

function getAllContests(req, res, next) {
  models.Contest.find({}, function (err, contests) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!contests || !contests.length)
      return res.sendStatus(404);

    return res.status(200).json({contests: contests});
  });
}

function getContestsById(req, res, next) {
  const contestId = req.params.id;

  models.Contest.findByContestsId(contestId, function (err, contest) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!contest)
      return res.sendStatus(404);

    return res.status(200).json({contest: contest});
  });
}

function getContestScoresById(req, res, next) {
  const contestId = req.params.id;

  models.Contest.findScoresByContestId(contestId, function (err, contestants) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    return res.status(200).json({contestants: contestants});
  });
}

function createContests(req, res, next) {
  const requestedContests = new models.Contest(req.body);

  requestedContests.save(function (err, contest) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    return res.status(201).json({id: contest._id});
  });
}

function updateContests(req, res, next) {
  const contestId = req.params.id;
  const contest = req.body;
  const options = {new: true, runValidators: true};

  models.Contest.findByIdAndUpdate(contestId, contest, options, function (err, updatedContests) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!updatedContests)
      return res.sendStatus(404);

    return res.status(200).json({contest: updatedContests});
  });
}

function deleteContests(req, res, next) {
  const contestId = req.params.id;

  models.Contest.findByIdAndRemove(contestId, function (err, removedContests) {
    if (err) {
      log.error({err: err});
      return next(err);
    }

    if (!removedContests)
      return res.sendStatus(404);

    return res.sendStatus(204);
  });
}
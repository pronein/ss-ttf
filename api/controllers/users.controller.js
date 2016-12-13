const models = require('../../models/models');

module.exports = {
  getById: getUserById,
  register: registerNewUser,
  token: getToken
};

function getUserById(req, res, next) {

  models.User.findByUserId(req.params.id, function (err, user) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.sendStatus(204);
    }

    return res.json(user);
  })
}

function registerNewUser(req, res, next) {

  const requestedUser = new models.User(req.body);

  requestedUser.save(function (err, user) {
    if (err) {
      return next(err);
    }

    return res.status(201).json({id: user._id});
  })
}

function getToken(req, res, next) {
  console.log('getToken reached.');
  console.log('getToken req: ' + JSON.stringify(req.user));
  return res.sendStatus(200);
}

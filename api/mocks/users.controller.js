module.exports = {
  getById: getUserById,
  register: registerNewUser,
  token: getToken
};

function getUserById(req, res) {
  return getToken(req, res);
  if (req.swagger.params.id.value == 200) {
    res.status(200).json({
      firstName: 'Adam',
      lastName: 'Schrader',
      username: 'pronein',
      email: 'adam.dot.schrader@gmail.com'
    });
  } else if (req.swagger.params.id.value == 204) {
    res.sendStatus(204);
  } else {
    res.status(500).json({message: 'An error occurred for id: ' + req.swagger.params.id.value});
  }
}

function registerNewUser(req, res) {
  var userToRegister = req.swagger.params.user.value;

  if (userToRegister.firstName == 500) {
    res.status(500).json({message: 'An error occurred while trying to register the new user.'});
  } else {
    res.status(201).json({id: '507f1f77bcf86cd799439011'});
  }
}

function getToken(req, res) {
  console.log('getToken.');
  var creds = req.swagger.params.credentials;

  console.log('creds: ' + creds);
  res.setHeader('X-Auth', '123.456.789');
  console.log('header: ' + res.getHeader('X-Auth'));
  res.status(200);
  res.end('ok');
}
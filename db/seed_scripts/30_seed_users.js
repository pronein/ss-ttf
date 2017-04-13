// Mongo script
print('Empty [users] collection...');
db.users.remove({});

var adminRoleId = db
  .roles
  .find({name: 'admin'}, {_id: 1})
  .map(function (role) {
    return role._id
  });

print('Create [Schrader, Adam] user...');
db.users.insert({
  firstName: 'Adam',
  lastName: 'Schrader',
  registrationDate: ISODate('2017-01-01'),
  username: 'pronein',
  password: '$2a$10$P56gyRfge/3uFEIo9s8Oku4moQImyLbeLjgU0WC3krOeltDGPJI1G',
  email: 'adam.dot.schrader@gmail.com',
  roles: adminRoleId
});

print('Create [Schrader, Craig] user...');
db.users.insert({
  firstName: 'Craig',
  lastName: 'Schrader',
  registrationDate: ISODate('2017-05-01'),
  username: 'creyg',
  password: '$2a$10$P56gyRfge/3uFEIo9s8Oku4moQImyLbeLjgU0WC3krOeltDGPJI1G',
  email: 'garbage@gmail.com',
  roles: []
});

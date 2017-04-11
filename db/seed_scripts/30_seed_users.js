// Mongo script
print('Empty [users] collection...');
db.users.remove({});

print('Create [Schrader, Adam] user...');
var adminRoleId = db.roles.find({name: 'admin'}, {_id: 1}).map(function(role) {return role._id});
db.users.insert({
  firstName: 'Adam',
  lastName: 'Schrader',
  registrationDate: ISODate('2017-01-01'),
  username: 'pronein',
  password: '$2a$10$P56gyRfge/3uFEIo9s8Oku4moQImyLbeLjgU0WC3krOeltDGPJI1G',
  email: 'adam.dot.schrader@gmail.com',
  roles: adminRoleId
});
// Mongo script
print('Empty [roles] collection...');
db.roles.remove({});

print('Insert [admin] role...');
var permissionIds = db.permissions.find({}, {_id:1}).map(function(permission) {return permission._id});
db.roles.insert({
  name: 'admin',
  description: 'Main administrator role',
  permissions: permissionIds
});
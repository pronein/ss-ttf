// Mongo script
print('Empty [permissions] collection...');
db.permissions.remove({});

print('Insert [permission_admin] premission...');
db.permissions.insert({
  name: 'Permission: Admin',
  key: 'permission_admin',
  description: 'Allow full access to permissions.'
});

print('Insert [role_admin] premission...');
db.permissions.insert({
  name: 'Role: Admin',
  key: 'role_admin',
  description: 'Allow full access to roles.'
});

print('Insert [user_admin] premission...');
db.permissions.insert({
  name: 'User: Admin',
  key: 'user_admin',
  description: 'Allow full access to users.'
});

print('Insert [trip_admin] premission...');
db.permissions.insert({
  name: 'Trip: Admin',
  key: 'trip_admin',
  description: 'Allow full access to trips.'
});
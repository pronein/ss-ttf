// Mongo script
print('Empty [photos] collection...');
db.photos.remove({});

var userIds = db
  .users
  .find({}, {_id: 1})
  .map(function (user){
    return user._id;
  });

print('Create avatar photo for new users');
db.photos.insert({
  name: 'no_avatar.jpg',
  uploadedBy: userIds[0]
});

print('Create photos for trip to Lake Lanier (GA)');
db.photos.insert({
  caption: 'First Demo Photo',
  name: 'demo_photo_1.jpg',
  uploadedBy: userIds[1]
});

db.photos.insert({
  caption: 'Nice Catch!',
  name: 'demo_photo_2.jpg',
  uploadedBy: userIds[1],
  uploadLocation: {
    latitude: 0,
    longitude: 0
  }
});

db.photos.insert({
  caption: 'Sleepy Time...',
  name: 'demo_photo_3.jpg',
  uploadedBy: userIds[1],
  uploadLocaltion: {
    latitude: 0,
    longitude: 0
  }
});

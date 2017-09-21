// Mongo script
var noAvatarName = 'no_avatar.jpg';

print('Empty [photos] collection...');
db.photos.remove({});

var userIds = db
  .users
  .find({}, {_id: 1})
  .map(function (user) {
    return user._id;
  });

print('Create avatar photo for new users');
db.photos.insert({
  caption: 'No Avatar',
  date: ISODate('2017-01-01'),
  name: noAvatarName,
  uploadedOn: ISODate('2017-01-01'),
  uploadedBy: userIds[0],
  image: {
    originalName: 'no_avatar.jpg',
    generatedName: 'no_avatar.jpg',
    uri: 'avatars/no_avatar.jpg'
  },
  uploadLocation: {
    latitude: 0,
    longitude: 0
  }
});

print('Update users to contain no_avatar.jpg as their avatar');
var noAvatarPhotoId = db
  .photos
  .find({name: noAvatarName}, {_id: 1})
  .map(function (photo) {
    return photo._id;
  })[0];

db.users.update({}, {$set: {avatar: noAvatarPhotoId}}, {multi: true});

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

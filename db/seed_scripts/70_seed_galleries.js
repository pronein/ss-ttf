// Mongo script
print('Empty [galleries] collection...');
db.galleries.remove({});

var userIds = db
  .users
  .find({}, {_id: 1})
  .map(function (user){
    return user._id;
  });

var tripIds = db
  .trips
  .find({}, {_id: 1})
  .map(function (trip) {
    return trip._id;
  });

var photoCollection = db
  .photos
  .find({uploadedBy: userIds[1]}, {_id: 1})
  .map(function (photo) {
    return photo._id;
  });

print('Create initial gallery for trip at Lake Lanier (GA)');
db.galleries.insert({
  title: "This Year's Trip",
  createdBy: userIds[0],
  photos: photoCollection,
  trip: tripIds[0],
  createdOn: ISODate('2017-05-01')
});

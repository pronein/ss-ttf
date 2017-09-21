// Mongo script
print('Empty [contests] collection...');
db.contests.remove({});

var userIds = db
  .users
  .find({username: {$ne: 'sys'}}, {_id: 1})
  .map(function (user){
    return user._id;
  });

var tripIds = db
  .trips
  .find({}, {_id: 1})
  .map(function (trip) {
    return trip._id;
  });

print('Create initial contest for trip at Indian Lake (OH) 2017');
db.contests.insert({
  title: "Indian Lake V",
  scoring: [
    {species: 'Saugeye', value: 1},
    {species: 'White Bass', value: 0.5},
    {species: 'Catfish', value: 0.5},
    {species: 'Snail', value: 0.5},
    {species: 'Crappie', value: 0.5}
  ],
  fishCaught: [],
  trip: tripIds[0],
  contestants: userIds,
  startTime: ISODate('2017-05-06'),
  endTime: ISODate('2017-05-13')
});

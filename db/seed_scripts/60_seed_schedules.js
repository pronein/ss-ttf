// Mongo script
print('Empty [schedules] collection...');
db.schedules.remove({});

var userIds = db
  .users
  .find({}, {_id: 1})
  .map(function (user) {
    return user._id;
  });

var tripId = db
  .trips
  .find({}, {_id: 1})
  .map(function (trip) {
    return trip._id;
  })[0];

print('Create schedule for Lake Lanier trip (GA)');
db.schedules.insert({
  title: 'Lake Lanier 2017',
  month: 5,
  year: 2017,
  createdBy: userIds[0],
  associatedTrip: tripId,
  events: [
    {
      _id: new ObjectId(),
      title: 'Buy bait',
      startTime: ISODate('2017-05-03T09:30:00'),
      endTime: ISODate('2017-05-03T11:00:00'),
      createdBy: userIds[0],
      members: userIds,
      description: 'Need to swing out to refresh our bait stores.'
    }
  ],
  meals: [
    {
      _id: new ObjectId(),
      title: 'Poptarts',
      designation: 'Anytime',
      date: ISODate('2017-05-02'),
      createdBy: userIds[1],
      providedBy: userIds[1]
    },
    {
      _id: new ObjectId(),
      title: 'Buck Beans',
      designation: 'Dinner',
      date: ISODate('2017-05-03'),
      createdBy: userIds[1],
      providedBy: userIds[0]
    },
    {
      _id: new ObjectId(),
      title: 'Steak & Eggs',
      designation: 'Breakfast',
      date: ISODate('2017-05-03'),
      createdBy: userIds[0],
      providedBy: userIds[0]
    }
  ]
});
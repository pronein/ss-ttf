// Mongo script
print('Empty [checklists] collection...');
db.checklists.remove({});

const userIds = db
  .users
  .find({}, {_id: 1})
  .map(function (user) {
    return user._id;
  });

const tripIds = db
  .trips
  .find({}, {_id: 1})
  .map(function (trip) {
    return trip._id;
  });

print('Create checklist for initial user (private)');
db.checklists.insert({
  title: 'My first private checklist',
  createdBy: userIds[0],
  trip: tripIds[0],
  accessibleBy: false,
  items: [
    {
      _id: new ObjectId(),
      description: 'Item 1',
      isChecked: false,
      accessLevel: false
    },
    {
      _id: new ObjectId(),
      description: 'Item 2',
      isChecked: true,
      accessLevel: false
    },
    {
      _id: new ObjectId(),
      description: 'Item 3',
      isChecked: false,
      accessLevel: false
    }
  ]
});

print('Create checklist for initial user (public)');
db.checklists.insert({
  title: 'My first public checklist',
  createdBy: userIds[1],
  trip: tripIds[1],
  accessibleBy: true,
  items: [
    {
      _id: new ObjectId(),
      description: 'Item 4',
      isChecked: true,
      accessLevel: true
    },
    {
      _id: new ObjectId(),
      description: 'Item 5',
      isChecked: true,
      accessLevel: false
    },
    {
      _id: new ObjectId(),
      description: 'Item 6',
      isChecked: false,
      accessLevel: true
    }
  ]
});

/*
 print('Create checklist for initial user (accessible by other user)');
 db.checklists.insert({
 title: 'My first checklist',
 createdBy: userId,
 trip: tripId,
 accessibleBy: false
 });
 */

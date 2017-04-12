// Mongo script
print('Empty [trips] collection...');
db.trips.remove({});

print('Create initial trip at Lake Lanier (GA)');
db.trips.insert({
  startDate: ISODate('2017-05-01'),
  endDate: ISODate('2017-05-08'),
  locationLatitude: 34.2930628,
  locationLongitude: -83.9050906
});

print('Create second trip at Lake Lanier (GA)');
db.trips.insert({
  startDate: ISODate('2017-06-01'),
  endDate: ISODate('2017-06-08'),
  locationLatitude: 34.2930628,
  locationLongitude: -83.9050906
});
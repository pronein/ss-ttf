var seeds = cd('./db/seed_scripts');
var seedPaths = ls();

for (var idx = 0; idx < seedPaths.length; idx++) {
  var seed = seedPaths[idx];

  print('Running "' + seed + '" ...');

  load(seed);
}
const spawnSync = require('child_process').spawnSync;
const connectionString = require('../config/config').mongo.connectionString();
const console = require('console');

const result = spawnSync('mongo', [connectionString, './db/deploy.js']);

if (result.error)
  console.error(result.stderr.toString());
else
  console.log(result.stdout.toString());

console.info('Seeding process finished with exit code: ' + result.status);
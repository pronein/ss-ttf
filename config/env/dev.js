const bunyan = require('bunyan');
const config = {
  mongo: {
    host: '127.0.0.1',
    port: 27017,
    db: 'ss_ttf_dev',
    connectionString: function () {
      return config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db;
    },
    mongooseConnectionString: function () {
      return 'mongodb://' + config.mongo.connectionString();
    }
  },
  bunyan: {
    baseOptions: {
      name: 'main',
      src: true,
      streams: [
        {
          path: './ss-ttf-debug.log',
          level: 'trace'
        },
        {
          stream: process.stdout,
          level: 'trace'
        }
      ],
      serializers: bunyan.stdSerializers
    }
  },
  jwt: {
    secret: 'itsasecrettoeveryone',
    timeOut: 30
  }
};

module.exports = config;
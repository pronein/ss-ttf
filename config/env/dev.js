const bunyan = require('bunyan');

module.exports = {
  mongo: {
      connectionString: 'mongodb://localhost/ss_ttf_dev'
  },
  bunyan: {
    baseOptions: {
      name: 'main',
      src: true,
      streams: [{
        path: './ss-ttf-debug.log',
        level: 'trace'
      }],
      serializers: bunyan.stdSerializers
    }
  }
};
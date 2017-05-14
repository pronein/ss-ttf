'use strict';

const bunyan = require('bunyan');
const serverHost = '127.0.0.1';
const serverPort = '3000';
const serverProtocol = 'http';

const config = {
  server: {
    protocol: serverProtocol,
    host: serverHost,
    port: serverPort
  },
  mongo: {
    host: serverHost,
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
    timeOut: 30,
    issuer: serverProtocol + '://' + serverHost + ':' + serverPort + '/'
  },
  uploads: {
    galleryPath: 'galleries',
    loosePath: 'galleries/loose',
    avatarPath: 'avatars'
  }
};

module.exports = config;
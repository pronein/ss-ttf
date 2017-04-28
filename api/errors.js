'use strict';

const Authorization = function (message) {
  Error.call(this);
  this.status = 401;
  this.statusText = message;
};

Authorization.prototype = Object.create(Error.prototype);
Authorization.prototype.constructor = Authorization;

const InternalServer = function (message) {
  Error.call(this);
  this.status = 500;
  this.statusText = message;
};

InternalServer.prototype = Object.create(Error.prototype);
InternalServer.prototype.constructor = InternalServer;

const PhotoNotFound = function (photoName) {
  Error.call(this);
  this.status = 404;
  this.statusText = 'Could not find photo named: ' + photoName;
};

PhotoNotFound.prototype = Object.create(Error.prototype);
PhotoNotFound.prototype.constructor = PhotoNotFound;

module.exports = {
  Authorization: Authorization,
  InternalServer: InternalServer,
  PhotoNotFound: PhotoNotFound
};

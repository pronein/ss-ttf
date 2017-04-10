'use strict';

var Authorization = function (message) {
  Error.call(this);
  this.status = 401;
  this.statusText = message;
};

Authorization.prototype = Object.create(Error.prototype);
Authorization.prototype.constructor = Authorization;

var InternalServer = function (message) {
  Error.call(this);
  this.status = 500;
  this.statusText = message;
};

InternalServer.prototype = Object.create(Error.prototype);
InternalServer.prototype.constructor = InternalServer;

module.exports = {
  Authorization: Authorization,
  InternalServer: InternalServer
};

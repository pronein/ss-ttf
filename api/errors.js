'use strict';

var Authorization = function(message) {
  Error.call(this);
  this.status = 401;
  this.statusText = message;
};

Authorization.prototype = Object.create(Error.prototype);
Authorization.prototype.constructor = Authorization;

module.exports = {
  Authorization: Authorization
};

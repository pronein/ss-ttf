const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

var userSchema = new Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  email: String,
  registrationDate: Date
});

userSchema.statics.findByUserId = function (userId, errUserCb) {
  return this.findById({_id: userId}, errUserCb);
};

userSchema.statics.findByUsername = function (username, errUserCb) {
  return this.findOne({username: username}, errUserCb);
};

userSchema.methods.validatePassword = function(password, errSuccessCb) {
  console.log('validatePassword: ' + password + ' ' + this.password);

  bcrypt.compare(password, this.password, errSuccessCb);
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user._id;
  delete user.password;
  //noinspection JSUnresolvedVariable
  delete user.__v;
  return user;
};

userSchema.pre('save', function (next) {
  var user = this;

  if (!user.registrationDate) {
    user.registrationDate = new Date();
  }
  if (user.isModified('password')) {
    bcrypt.hash(this.password, null, null, function (err, hash) {
      if (err) next(err);

      user.password = hash;
      next();
    });
  }
});

module.exports = mongoose.model('User', userSchema);
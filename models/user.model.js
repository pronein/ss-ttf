const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    email: String,
    registrationDate: Date
});

userSchema.statics.findByUserId = function(userId, errUserCb){
    return this.findById({_id: userId}, errUserCb);
};

userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user._id;
    delete user.password;
    delete user.__v;
    return user;
};

module.exports = mongoose.model('User', userSchema);
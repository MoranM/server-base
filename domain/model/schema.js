var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    emailVerificationToken: String,
    emailVerified: {type: Boolean, default: false},
    token: String,
    creationDate: Date,
    lastLoginDate: Date,
});


module.exports = {
    User: mongoose.model('User', UserSchema),
};
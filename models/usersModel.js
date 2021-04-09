const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
   
      email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    emailVerified: {
        type: Boolean,
        default: false,
        required: true
    }
});

const User = mongoose.model('User', UserSchema)

module.exports = User;

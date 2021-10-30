require('dotenv').config();
const mongoose = require('mongoose');
const ROLE = {
    ADMIN: process.env.ADMIN,
    USER: process.env.USER,
    ROOT: process.env.ROOT
  }
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
    },
    role:{
        type: String, 
        default: ROLE.USER, 
        enum: [ROLE.USER, ROLE.ADMIN,ROLE.ROOT]
    }
});

const User = mongoose.model('User', UserSchema)

module.exports = User;

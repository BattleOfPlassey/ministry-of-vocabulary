const mongoose = require('mongoose');
const ROLE = {
    ADMIN: 'ayJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNzFjOTY3YzM1MmM0MDAxNTE5MDJmMyIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTYyMjI5MTIyNX0.s87wzlIa_a2NXxBWDR5SiohvNFAkSPmRgMkfhkk-mQg',
    USER: 'uyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwN2ZhYzVmM2M5ZTRjMDAxNWFhMzg4OSIsImVtYWlsIjoidGVzdDFAdGVzdC5jb20iLCJpYXQiOjE2MjIyOTg2NzZ9.oIM-gCDpj-tnM49WXmR68BSes-zoa65nnSivMvugE0k',
    ROOT: 'ryJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNzcxY2FlMjA0NTRjMDAxNWYzY2RhMSIsImVtYWlsIjoicGFsYXNoc2hhbnVAZ21haWwuY29tIiwiaWF0IjoxNjIyMjk4NjQzfQ.vKwYp8S43xan7wk1dkpY0Nn5uC6JGNPypcODIOF97F4'
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
